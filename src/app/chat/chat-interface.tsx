'use client';

import { useState, useRef, useEffect } from 'react';
import { Bot, User, Send, Mic, Volume2, CornerDownLeft, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { getAiChatResponse, getSpeechFromText } from '@/lib/actions';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

const suggestionPrompts = {
  investor: [
    'How do I diversify my portfolio?',
    'What are low-risk investment options?',
    'Explain SIP vs lump sum',
    'What are the key differences between stocks and bonds?',
  ],
  student: [
    'How do I start saving money?',
    'What is compound interest?',
    'What are the basics of budgeting?',
    'Can you explain what a credit score is?',
  ],
  SME: [
    'Tax-saving strategies for small businesses?',
    'Working capital management tips?',
    'What are some common business loan options?',
    'How can I improve my business\'s cash flow?',
  ],
  advisor: [
    'What were the latest RBI policy changes?',
    'What are some retirement planning best practices?',
    'Explain the tax implications of NPS.',
    'How does market volatility affect long-term investments?',
  ],
};

type UserType = keyof typeof suggestionPrompts;

export function ChatInterface() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [userType, setUserType] = useState<UserType>('investor');
  const [isLoading, setIsLoading] = useState(false);
  const [isSynthesizing, setIsSynthesizing] = useState<number | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  
  const audioRef = useRef<HTMLAudioElement | null>(null);
  if (typeof window !== 'undefined' && !audioRef.current) {
    audioRef.current = new Audio();
  }

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTo({
        top: scrollAreaRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return;

    if (messages.length === 0) {
      setShowSuggestions(false);
    }
    
    const newMessages: ChatMessage[] = [...messages, { role: 'user', content: messageContent }];
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const chatHistory = newMessages.slice(0, -1);
      const result = await getAiChatResponse({ message: messageContent, userType, chatHistory });
      setMessages([...newMessages, { role: 'assistant', content: result.response }]);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to get response from AI assistant."
      });
      setMessages(messages); // Revert to previous state
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitForm = async (e: React.FormEvent) => {
    e.preventDefault();
    handleSendMessage(input);
    setInput('');
  };

  const handleSuggestionClick = (suggestion: string) => {
    handleSendMessage(suggestion);
  };
  
  const handlePlayAudio = async (text: string, index: number) => {
    if (isSynthesizing !== null) return;
    setIsSynthesizing(index);
    try {
      const { media } = await getSpeechFromText(text);
      if (audioRef.current) {
        audioRef.current.src = media;
        audioRef.current.play();
        audioRef.current.onended = () => setIsSynthesizing(null);
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to synthesize speech."
      });
      setIsSynthesizing(null);
    }
  };


  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitForm(e as any);
    }
  };

  return (
    <div className="h-full flex flex-col bg-card border rounded-lg overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <ScrollArea className="h-full" ref={scrollAreaRef}>
          <div className="p-4 md:p-6 space-y-6">
            {messages.length === 0 && (
              <div className="text-center p-8">
                <Avatar className="w-16 h-16 border mx-auto mb-4">
                  <AvatarFallback><Bot size={32} /></AvatarFallback>
                </Avatar>
                <h2 className="text-xl font-semibold">AI Financial Assistant</h2>
                <p className="text-muted-foreground mt-2">
                  Select your profile and ask me anything about finance!
                </p>
              </div>
            )}
            {messages.map((message, index) => (
              <div
                key={index}
                className={cn(
                  'flex items-start gap-3',
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                {message.role === 'assistant' && (
                  <Avatar className="w-8 h-8 border">
                    <AvatarFallback><Bot size={18} /></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    'max-w-md rounded-lg p-3 text-sm relative group',
                    message.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted'
                  )}
                >
                  <p className="whitespace-pre-wrap">{message.content}</p>
                   {message.role === 'assistant' && (
                     <Button
                       variant="ghost"
                       size="icon"
                       className="absolute -bottom-2 -right-2 h-7 w-7 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                       onClick={() => handlePlayAudio(message.content, index)}
                       disabled={isSynthesizing !== null}
                     >
                       <Volume2 className={cn("h-4 w-4", isSynthesizing === index && "animate-pulse")} />
                     </Button>
                   )}
                </div>
                {message.role === 'user' && (
                  <Avatar className="w-8 h-8 border">
                     <AvatarImage data-ai-hint="person face" src="https://picsum.photos/seed/110/40/40" />
                    <AvatarFallback>U</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            {isLoading && (
              <div className="flex items-start gap-3">
                <Avatar className="w-8 h-8 border">
                  <AvatarFallback><Bot size={18} /></AvatarFallback>
                </Avatar>
                <div className="max-w-md rounded-lg p-3 bg-muted w-full">
                  <Skeleton className="h-4 w-1/4" />
                  <Skeleton className="h-4 w-3/4 mt-2" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {showSuggestions && messages.length === 0 && (
        <div className="px-4 pb-2 pt-4 border-t">
          <div className="flex flex-wrap items-center gap-2">
            {suggestionPrompts[userType].map((prompt, index) => (
              <button key={index} onClick={() => handleSuggestionClick(prompt)} className="suggestion-chip">
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="border-t bg-card p-4 md:p-6">
        <form onSubmit={handleSubmitForm} className="relative">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask about financial concepts, strategies, or markets..."
            className="pr-48 min-h-[60px] resize-none bg-background"
            disabled={isLoading}
          />
          <div className="absolute top-3 right-3 flex items-center gap-2">
            <Select onValueChange={(v: UserType) => setUserType(v)} defaultValue={userType} disabled={isLoading}>
              <SelectTrigger className="w-[120px] h-8 text-xs">
                <SelectValue placeholder="User type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="investor">Investor</SelectItem>
                <SelectItem value="student">Student</SelectItem>
                <SelectItem value="SME">SME</SelectItem>
                <SelectItem value="advisor">Advisor</SelectItem>
              </SelectContent>
            </Select>
            <Button type="submit" size="sm" disabled={isLoading || !input.trim()}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
           <div className="absolute bottom-3 right-3 flex items-center gap-1">
             <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" disabled={isLoading} onClick={() => setShowSuggestions(!showSuggestions)}>
              <Sparkles className="w-4 h-4" />
            </Button>
            <Button type="button" variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-primary" disabled={isLoading}>
              <Mic className="w-4 h-4" />
            </Button>
           </div>
           <div className="absolute bottom-2 left-3 text-xs text-muted-foreground flex items-center gap-1">
             <CornerDownLeft className="w-3 h-3"/> Shift+Enter for new line
           </div>
        </form>
      </div>
    </div>
  );
}

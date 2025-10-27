'use client';

import { useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { getArticleSummary, extractTextFromFile } from '@/lib/actions';
import { Loader2, Wand2, Lightbulb, TrendingUp, FileText, UploadCloud, X } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import type { SummarizeFinancialArticleOutput } from '@/ai/flows/summarize-financial-articles';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

type FileInfo = {
  name: string;
  size: number;
  wordCount: number;
};

export function SummarizerClient() {
  const [articleContent, setArticleContent] = useState('');
  const [summaryStyle, setSummaryStyle] = useState<'brief' | 'detailed' | 'actionable'>('brief');
  const [summary, setSummary] = useState<SummarizeFinancialArticleOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const { toast } = useToast();
  const [isDragOver, setIsDragOver] = useState(false);
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

  const handleFileChange = async (file: File | null) => {
    if (!file) return;
    setIsExtracting(true);
    setFileInfo(null);
    setArticleContent('');

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast({
        variant: 'destructive',
        title: 'File Too Large',
        description: 'Please upload a file smaller than 5MB.',
      });
      setIsExtracting(false);
      return;
    }

    const allowedExtensions = ['txt', 'pdf', 'docx'];
    const fileExtension = file.name.split('.').pop()?.toLowerCase();

    if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
       toast({
        variant: 'destructive',
        title: 'Invalid File Type',
        description: 'Please upload a .txt, .pdf, or .docx file.',
      });
      setIsExtracting(false);
      return;
    }
    
    if (fileExtension === 'docx') {
       setFileInfo({ name: file.name, size: file.size, wordCount: 0 });
       toast({
        title: 'File Uploaded (Partial Support)',
        description: 'Full parsing for DOCX will be available in the production version. You can still paste text manually.',
      });
      setIsExtracting(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append('file', file);
      const text = await extractTextFromFile(formData);
      setArticleContent(text);
      const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
      setFileInfo({ name: file.name, size: file.size, wordCount });
    } catch (error) {
       toast({
        variant: 'destructive',
        title: 'Failed to Extract Text',
        description: 'Could not extract text from the file. It may be corrupted or empty.',
      });
    } finally {
      setIsExtracting(false);
    }
  };


  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileChange(e.dataTransfer.files[0]);
      e.dataTransfer.clearData();
    }
  };
  
  const handleClearFile = () => {
    setFileInfo(null);
    setArticleContent('');
  }

  const handleSubmit = async () => {
    if (!articleContent.trim()) {
      toast({
        variant: 'destructive',
        title: 'Input Required',
        description: 'Please paste or upload article content before summarizing.',
      });
      return;
    }
    setIsLoading(true);
    setSummary(null);
    try {
      const result = await getArticleSummary({ articleContent, summaryStyle });
      setSummary(result);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Summarization Failed',
        description: 'Could not generate summary. Please try again later.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const charCount = articleContent.length;
  const wordCount = articleContent.trim().split(/\s+/).filter(Boolean).length;


  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Article Input</CardTitle>
          <CardDescription>
            Paste the text or upload a file you want to summarize.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div 
            className={cn("dropzone", isDragOver && "active")}
            onDragOver={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
            onDragEnter={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(true); }}
            onDragLeave={(e) => { e.preventDefault(); e.stopPropagation(); setIsDragOver(false); }}
            onDrop={handleDrop}
          >
            {isExtracting ? (
              <div className='text-center'>
                <Loader2 className="h-8 w-8 text-muted-foreground animate-spin mx-auto" />
                <p className="mt-2 text-muted-foreground">Extracting text...</p>
              </div>
            ) : (
              <>
                <UploadCloud className="h-8 w-8 text-muted-foreground" />
                <p className="text-muted-foreground">
                  <label htmlFor="file-upload" className="text-primary font-semibold cursor-pointer hover:underline">Click to upload</label> or drag and drop
                </p>
                <p className="text-xs text-muted-foreground">.txt or .pdf (Max 5MB)</p>
                <Input id="file-upload" type="file" className="sr-only" onChange={(e) => handleFileChange(e.target.files?.[0] || null)} accept=".txt,.pdf,.docx" disabled={isExtracting} />
              </>
            )}
          </div>

          {fileInfo && (
            <div className="p-3 bg-muted rounded-lg flex items-center justify-between text-sm">
              <div>
                  <p className="font-semibold">{fileInfo.name}</p>
                  <p className="text-xs text-muted-foreground">
                    {(fileInfo.size / 1024).toFixed(2)} KB
                    {fileInfo.wordCount > 0 && ` / ${fileInfo.wordCount} words`}
                  </p>
              </div>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={handleClearFile}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}

          <Textarea
            placeholder="Paste your article here..."
            className="min-h-[250px] lg:min-h-[300px] resize-y"
            value={articleContent}
            onChange={(e) => setArticleContent(e.target.value)}
          />
           <div className="text-right text-xs text-muted-foreground">
            {charCount} characters / ~{wordCount} words
          </div>

          <div className="space-y-2">
            <Label>Summary Style</Label>
            <RadioGroup
              defaultValue="brief"
              className="flex gap-4"
              onValueChange={(value: 'brief' | 'detailed' | 'actionable') => setSummaryStyle(value)}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="brief" id="r1" />
                <Label htmlFor="r1">Brief</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="detailed" id="r2" />
                <Label htmlFor="r2">Detailed</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="actionable" id="r3" />
                <Label htmlFor="r3">Actionable</Label>
              </div>
            </RadioGroup>
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={isLoading || isExtracting}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Summarizing...
              </>
            ) : (
              <>
                <Wand2 className="mr-2 h-4 w-4" />
                Summarize
              </>
            )}
          </Button>
        </CardFooter>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>AI-Generated Summary</CardTitle>
          <CardDescription>
            Here are the key takeaways from the article.
          </CardDescription>
        </CardHeader>
        <CardContent className="min-h-[300px] lg:min-h-[400px] space-y-6">
          {isLoading && (
            <div className="space-y-6">
              <div className="space-y-2">
                 <Skeleton className="h-5 w-1/4" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-3/4" />
              </div>
              <div className="space-y-2">
                 <Skeleton className="h-5 w-1/3" />
                 <Skeleton className="h-4 w-5/6" />
                 <Skeleton className="h-4 w-4/6" />
              </div>
            </div>
          )}
          {summary && !isLoading && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2">
                  <Wand2 className="mr-2 h-5 w-5 text-primary" />
                  Summary
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {summary.summary}
                </p>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2">
                  <Lightbulb className="mr-2 h-5 w-5 text-primary" />
                  Key Points
                </h3>
                <ul className="space-y-2">
                  {summary.keyPoints.map((point, index) => (
                    <li key={index} className="flex items-start">
                      <Badge variant="outline" className="mr-2 mt-1 bg-accent/20 border-accent/50 text-accent-foreground">
                        {index + 1}
                      </Badge>
                      <span className="text-sm text-muted-foreground">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <Separator />
              <div>
                <h3 className="text-lg font-semibold flex items-center mb-2">
                  <TrendingUp className="mr-2 h-5 w-5 text-primary" />
                  Impact Analysis
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {summary.impactAnalysis}
                </p>
              </div>
            </div>
          )}
          {!summary && !isLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center p-4">
              <div className="p-4 bg-muted rounded-full mb-4">
                <FileText className="h-10 w-10 text-muted-foreground" />
              </div>
              <p className="font-semibold">Your summary will appear here</p>
              <p className="text-sm text-muted-foreground">
                Provide an article and select a style to get started.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

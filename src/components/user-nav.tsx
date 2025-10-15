'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function UserNav() {
  return (
    <Button asChild>
      <Link href="/login">Login</Link>
    </Button>
  );
}

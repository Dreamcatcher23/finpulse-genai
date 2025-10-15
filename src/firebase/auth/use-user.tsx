'use client';

import { useEffect, useState } from 'react';
import type { User } from 'firebase/auth';
import { useAuth } from '@/firebase';

export const useUser = () => {
  const auth = useAuth();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
      if (user) {
        document.cookie = 'authed=true; path=/; max-age=2592000'; // 30 days
      } else {
        document.cookie =
          'authed=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      }
    });

    return () => unsubscribe();
  }, [auth]);

  return { user, loading };
};

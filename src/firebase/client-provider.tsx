'use client';

import { useMemo } from 'react';
import { initializeFirebase } from '.';
import { FirebaseProvider, FirebaseProviderProps } from './provider';

export const FirebaseClientProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { firebaseApp, firestore, auth } = useMemo(
    () => initializeFirebase(),
    []
  );

  return (
    <FirebaseProvider
      firebaseApp={firebaseApp}
      firestore={firestore}
      auth={auth}
    >
      {children}
    </FirebaseProvider>
  );
};

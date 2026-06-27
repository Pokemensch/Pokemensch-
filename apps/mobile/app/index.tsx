import { Redirect } from 'expo-router';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Index() {
  const [session, setSession] = useState<null | object>(undefined as any);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
  }, []);

  if (session === undefined) return null;
  if (!session) return <Redirect href="/auth" />;
  return <Redirect href="/(tabs)/dashboard" />;
}

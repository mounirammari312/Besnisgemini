import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabaseQuery<T>(
  tableName: string,
  queryFn?: (query: any) => any,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  const fetchData = useCallback(async (isMounted = true) => {
    if (isMounted) setLoading(true);
    try {
      let query = supabase.from(tableName).select('*');
      if (queryFn) {
        query = queryFn(query);
      }
      
      const { data: result, error: queryError } = await query;
      
      if (queryError) throw queryError;
      
      if (isMounted) {
        setData(result as T[]);
      }
    } catch (e) {
      if (isMounted) {
        setError(e);
      }
    } finally {
      if (isMounted) {
        setLoading(false);
      }
    }
  }, [tableName, ...dependencies]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    let isMounted = true;
    fetchData(isMounted);

    // Real-time subscription
    const channel = supabase
      .channel(`public:${tableName}:${JSON.stringify(dependencies)}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        fetchData(isMounted);
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [fetchData, tableName]);

  return { data, loading, error, refresh: () => fetchData(true) };
}

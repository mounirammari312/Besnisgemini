import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

export function useSupabaseQuery<T>(
  tableName: string,
  queryFn?: (query: any) => any,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      setLoading(true);
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
    };

    fetchData();

    // Real-time subscription
    const channel = supabase
      .channel(`public:${tableName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: tableName }, () => {
        fetchData();
      })
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, [tableName, ...dependencies]);

  return { data, loading, error };
}

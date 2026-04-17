import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import { Loader2 } from 'lucide-react';

export function AuthCallbackPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleAuth = async () => {
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error || !session) {
        console.error('Error in callback session:', error);
        navigate('/login');
        return;
      }

      const role = searchParams.get('role') || 'buyer';
      const company = searchParams.get('company') || '';

      // Create profile if doesn't exist
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code === 'PGRST116') {
        // Create new profile
        const { error: createError } = await supabase.from('profiles').insert({
          id: session.user.id,
          email: session.user.email,
          display_name: session.user.user_metadata.full_name,
          photo_url: session.user.user_metadata.avatar_url,
          role,
          company_name: company
        });

        if (createError) console.error('Error creating profile:', createError);
        
        // If supplier, create base supplier entry directly
        if (role === 'supplier') {
          await supabase.from('suppliers').insert([{
            id: session.user.id,
            name: session.user.user_metadata.full_name,
            company_name: company,
            rating: 0,
            verified: false,
            joined: new Date().getFullYear().toString()
          }]);
        }
      }

      navigate('/');
    };

    handleAuth();
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="font-bold text-xl tracking-tighter italic uppercase text-primary">BUSINFO PROCESSING...</p>
    </div>
  );
}

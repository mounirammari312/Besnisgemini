import { useState, useEffect } from 'react';
import { db } from '@/firebase';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  QueryConstraint,
  DocumentData,
  QuerySnapshot
} from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '@/lib/firestore-errors';

export function useFirestoreCollection<T = DocumentData>(
  collectionPath: string,
  constraints: QueryConstraint[] = []
) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    const q = query(collection(db, collectionPath), ...constraints);

    const unsubscribe = onSnapshot(
      q,
      (snapshot: QuerySnapshot<DocumentData>) => {
        const items = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        } as T));
        setData(items);
        setLoading(false);
      },
      (err) => {
        const errorMsg = `Error fetching collection ${collectionPath}`;
        console.error(errorMsg, err);
        setError(errorMsg);
        setLoading(false);
        // We don't throw here to avoid crashing the whole view, 
        // but we log it via our handler for diagnostic purposes if it's a permission error
        if (err.message.includes('permission')) {
          try {
            handleFirestoreError(err, OperationType.LIST, collectionPath);
          } catch (e) {
            // Error captured in logs
          }
        }
      }
    );

    return () => unsubscribe();
  }, [collectionPath, JSON.stringify(constraints)]);

  return { data, loading, error };
}

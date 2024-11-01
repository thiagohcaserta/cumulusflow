import { useCallback, useState } from 'react';

export function useAI() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const analyzeCode = useCallback(async (code) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      return data.suggestions;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const generateTests = useCallback(async (code) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
      });
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const analyzePerformance = useCallback(async (metrics) => {
    setLoading(true);
    try {
      const response = await fetch('/api/ai/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ metrics })
      });
      return await response.json();
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    analyzeCode,
    generateTests,
    analyzePerformance,
    loading,
    error
  };
}
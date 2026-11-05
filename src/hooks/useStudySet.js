import { useCallback, useEffect, useRef, useState } from 'react';
import { StudySetSchema, normalizeStudySet } from '../../shared/studySchema.js';
import { requestStudySet } from '../services/api.js';

export function useStudySet() {
  const [status, setStatus] = useState('idle');
  const [studySet, setStudySet] = useState(null);
  const [error, setError] = useState('');
  const controllerRef = useRef(null);
  const requestIdRef = useRef(0);

  const generate = useCallback(async (notes) => {
    controllerRef.current?.abort();
    const controller = new AbortController();
    controllerRef.current = controller;
    const requestId = ++requestIdRef.current;

    setStatus('loading');
    setError('');
    setStudySet(null);

    try {
      const rawData = await requestStudySet(notes, controller.signal);
      if (requestId !== requestIdRef.current) return null;

      const validation = StudySetSchema.safeParse(rawData);
      if (!validation.success) {
        throw new Error('The generated study set was incomplete or had an unexpected structure. Please try again.');
      }

      const normalized = normalizeStudySet(validation.data);
      setStudySet(normalized);
      setStatus('success');
      return normalized;
    } catch (requestError) {
      if (requestError?.name === 'AbortError') return null;
      if (requestId !== requestIdRef.current) return null;

      setError(requestError?.message || 'Something went wrong. Please try again.');
      setStatus('error');
      return null;
    } finally {
      if (requestId === requestIdRef.current && controllerRef.current === controller) {
        controllerRef.current = null;
      }
    }
  }, []);

  const reset = useCallback(() => {
    requestIdRef.current += 1;
    controllerRef.current?.abort();
    controllerRef.current = null;
    setStudySet(null);
    setError('');
    setStatus('idle');
  }, []);

  useEffect(() => () => {
    requestIdRef.current += 1;
    controllerRef.current?.abort();
  }, []);

  return { status, studySet, error, generate, reset };
}

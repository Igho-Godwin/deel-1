// src/hooks/useUniversities.ts
import { useState, useCallback } from "react";
import { University } from "../types";

import _ from 'lodash';

export const useUniversities = () => {
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const fetchUniversities = useCallback(async (query: string) => {
    if (!query) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        `http://universities.hipolabs.com/search?name=${query}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch universities");
      }

      const data = await response.json();
      const typedData = data as University[];
      const uniQueData = _.uniqBy(typedData, 'name');
      setUniversities(uniQueData);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  return { universities, loading, error, fetchUniversities };
};

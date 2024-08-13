import { Tokens } from "@/constants";
import { useState, useEffect, useCallback, useRef } from "react";

interface UseQueryProps<T> {
  endpoint: string;
  method?: string;
  body?: Record<string, any>;
  onSuccess?: (data: T) => void;
  onError?: (error: Error) => void;
  fetchOnMount?: boolean;
}

const refreshAccessToken = async (): Promise<string | null> => {
  try {
    const refreshResponse = await fetch("/api/auth/refresh", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (refreshResponse.ok) {
      const refreshData = await refreshResponse.json();
      const newAccessToken = refreshData.accessToken;
      localStorage.setItem(Tokens.accessTokenId, newAccessToken);
      return newAccessToken;
    } else {
      throw new Error("Failed to refresh access token");
    }
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const useQuery = <T>({
  endpoint,
  method = "GET",
  body,
  onSuccess,
  onError,
  fetchOnMount = false,
}: UseQueryProps<T>): [
  () => Promise<void>,
  { data: T | null; loading: boolean; error: Error | null }
] => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  // Main function to execute the query
  const execute = useCallback(
    async (retry = true) => {
      setLoading(true);
      setError(null);

      const accessToken = localStorage.getItem(Tokens.accessTokenId);

      try {
        const response = await fetch(endpoint, {
          method,
          headers: {
            "Content-Type": "application/json",
            ...(accessToken && { Authorization: `Bearer ${accessToken}` }),
          },
          body: body ? JSON.stringify(body) : undefined,
        });

        const responseData = await response.json();

        if (response.ok) {
          setData(responseData);
          onSuccess?.(responseData);
        } else if (response.status === 401 && retry) {
          // If unauthorized, attempt to refresh the token and retry
          const newAccessToken = await refreshAccessToken();
          if (newAccessToken) {
            await execute(false); // Retry the original request
          } else {
            throw new Error(responseData.error || "Fetch error");
          }
        } else {
          throw new Error(responseData.error || "Fetch error");
        }
      } catch (error: any) {
        setError(error);
        onError?.(error);
      } finally {
        setLoading(false);
      }
    },
    [endpoint, method, body, onSuccess, onError]
  );

  // Execute on mount if specified
  const single = useRef(true);
  useEffect(() => {
    if (fetchOnMount && single.current) {
      single.current = false;

      // retry only if access token exists
      const retry = !!localStorage.getItem(Tokens.accessTokenId);
      execute(retry);
    }
  }, [execute, fetchOnMount]);

  return [execute, { data, loading, error }];
};

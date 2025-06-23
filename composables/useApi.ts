export const useApi = () => {
  const BASE_URL = useRuntimeConfig().API_BASE_URL;

  const fetch = async <T>(path: string, options: any = {}): Promise<T> => {
    return await $fetch<T>(BASE_URL + path, {
      ...options,
      headers: {
        ...(options?.headers || {}),
        "Content-Type": "application/json",
      },
    });
  };

  return { fetch };
};

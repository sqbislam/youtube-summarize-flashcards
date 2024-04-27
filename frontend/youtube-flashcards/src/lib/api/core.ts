export const apiCore = {
  url: import.meta.env.VITE_BACKEND_API_PATH,
  headers() {
    return {
      "Cache-Control": "no-cache",
      Accept: "application/json",
      "Content-Type": "application/json",
    };
  },
  headersWithAuth(token: string) {
    return {
      "Cache-Control": "no-cache",
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  },
};

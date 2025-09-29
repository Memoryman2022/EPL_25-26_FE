// Utility for making authenticated API requests
export const apiCall = async (url: string, options: RequestInit = {}) => {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status !== 404) {
      // Only log unexpected errors
      const errorData = await response
        .json()
        .catch(() => ({ error: "Unknown error" }));
      console.error(`HTTP error! status: ${response.status} for ${url}`);
      throw new Error(
        errorData.error || `HTTP error! status: ${response.status}`
      );
    } else {
      // For 404, throw a custom error with status
      const error: any = new Error(`HTTP error! status: 404`);
      error.status = 404;
      throw error;
    }
  }

  return response.json();
};

// Helper functions for common API operations
export const api = {
  get: <T = any>(url: string): Promise<T> => apiCall(url),

  post: <T = any>(url: string, data: any): Promise<T> =>
    apiCall(url, {
      method: "POST",
      body: JSON.stringify(data),
    }),

  put: <T = any>(url: string, data: any): Promise<T> =>
    apiCall(url, {
      method: "PUT",
      body: JSON.stringify(data),
    }),

  delete: <T = any>(url: string): Promise<T> =>
    apiCall(url, {
      method: "DELETE",
    }),
};

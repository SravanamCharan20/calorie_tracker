const BASE_URL = import.meta.env.VITE_BASE_URL;

const api = async (endpoint, options = {}) => {
  const isFormData = options.body instanceof FormData;

  const headers = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...options.headers,
  };

  let response;

  try {
    response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
    });
  } catch {
    throw new Error("Unable to reach the server.");
  }

  let data = {};

  try {
    data = await response.json();
  } catch {
    if (!response.ok) {
      throw new Error("Something went wrong");
    }
  }

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong");
  }

  return data;
};

export default api;

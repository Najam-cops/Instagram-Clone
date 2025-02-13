import axios, { AxiosRequestConfig } from "axios";

export const makeRequest = async (
  url: string,
  method: string = "GET",
  data: any = null,
  isPrivateApi: boolean = false
): Promise<any> => {
  const config: AxiosRequestConfig = {
    baseURL: "http://localhost:3000",
    url,
    method,
    data,
  };

  if (isPrivateApi) {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }
  }

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error("Request failed:", error);
    throw error;
  }
};

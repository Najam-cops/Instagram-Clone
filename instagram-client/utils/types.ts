export interface ApiRequest {
  url: string;
  method?: string;
  headers?: Record<string, string>;
  body?: Record<string, unknown>;
  params?: Record<string, unknown>;
  responseType?: string;
}

export interface ApiResponse {
  data: any;
  status: number;
}

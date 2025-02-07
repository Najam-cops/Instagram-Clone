import { makeRequest } from "../utils/ApiCall";

class ApiService {
  async login(email: string, password: string): Promise<any> {
    const url = "/auth/login";
    const method = "POST";
    const data = { email, password };
    const isPrivateApi = false;

    return await makeRequest(url, method, data, isPrivateApi);
  }

  async signup(username: string, password: string): Promise<any> {
    const url = "/auth/signup";
    const method = "POST";
    const data = { username, password };
    const isPrivateApi = false;

    return await makeRequest(url, method, data, isPrivateApi);
  }
}

export default new ApiService();

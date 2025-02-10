import { makeRequest } from "../utils/ApiCall";
import { POSTS_API_URL, SIGNUP_API_URL, LOGOUT_API_URL } from "./apiEndpoints";

interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
}

interface Post {
  id: string;
  description: string;
  images: { url: string }[];
  user: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  _count: {
    Likes: number;
  };
}

interface SignUpData {
  username: string;
  password: string;
  email: string;
  name: string;
}

class ApiService {
  async login(email: string, password: string): Promise<any> {
    const url = "/auth/login";
    const method = "POST";
    const data = { email, password };
    const isPrivateApi = false;

    return await makeRequest(url, method, data, isPrivateApi);
  }

  async signup(data: SignUpData): Promise<any> {
    const method = "POST";
    const isPrivateApi = false;

    return await makeRequest(SIGNUP_API_URL, method, data, isPrivateApi);
  }

  async getPosts(cursor?: string, take: number = 10): Promise<PostsResponse> {
    const url = `${POSTS_API_URL}?${
      cursor ? `cursor=${cursor}&` : ""
    }take=${take}`;
    return await makeRequest(url, "GET", null, true);
  }

  async createPost(description: string, files: File[]): Promise<Post> {
    const formData = new FormData();
    formData.append("description", description);
    files.forEach((file) => formData.append("files", file));

    return await makeRequest(POSTS_API_URL, "POST", formData, true);
  }

  async logout(): Promise<any> {
    return await makeRequest(LOGOUT_API_URL, "POST", null, true);
  }
}

export default new ApiService();

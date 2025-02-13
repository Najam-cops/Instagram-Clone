import { makeRequest } from "../utils/ApiCall";
import {
  POSTS_API_URL,
  SIGNUP_API_URL,
  LOGOUT_API_URL,
  USERS_API_URL,
  FOLLOWS_API_URL,
  BLOCK_USER,
  UNBLOCK_USER,
} from "./apiEndpoints";

interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
}

interface Post {
  id: string;
  description: string;
  owned: boolean;
  images: { url: string }[];
  user: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  _count: {
    likes: number;
    comments: number;
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

  // User related methods
  async getUserDetails(userId: string): Promise<any> {
    return await makeRequest(`${USERS_API_URL}/${userId}`, "GET", null, true);
  }

  async getUserRequests(userId: string): Promise<any> {
    return await makeRequest(
      `${USERS_API_URL}/${userId}/requests`,
      "GET",
      null,
      true
    );
  }

  async getUserFollowers(userId: string): Promise<any> {
    return await makeRequest(
      `${USERS_API_URL}/${userId}/followers`,
      "GET",
      null,
      true
    );
  }

  async getUserBlocked(userId: string): Promise<any> {
    return await makeRequest(
      `${USERS_API_URL}/${userId}/blocked`,
      "GET",
      null,
      true
    );
  }

  async getUserPosts(): Promise<PostsResponse> {
    return await makeRequest(`${POSTS_API_URL}/`, "GET", null, true);
  }

  async getUserFollowing(userId: string): Promise<any> {
    return await makeRequest(
      `${USERS_API_URL}/${userId}/following`,
      "GET",
      null,
      true
    );
  }

  async acceptFollowRequest(requestId: string): Promise<any> {
    return await makeRequest(
      `${FOLLOWS_API_URL}/accept/${requestId}`,
      "POST",
      null,
      true
    );
  }

  async rejectFollowRequest(requestId: string): Promise<any> {
    return await makeRequest(
      `${FOLLOWS_API_URL}/reject/${requestId}`,
      "POST",
      null,
      true
    );
  }

  async deleteFollowRequest(requestId: string): Promise<any> {
    return await makeRequest(
      `${FOLLOWS_API_URL}/request/${requestId}`,
      "DELETE",
      null,
      true
    );
  }

  async changeProfileImage(file: File, userId: string): Promise<any> {
    const formData = new FormData();
    formData.append("file", file);

    return await makeRequest(
      `${USERS_API_URL}/${userId}/profile-image`,
      "POST",
      formData,
      true
    );
  }

  async getCurrentUser(): Promise<any> {
    return await makeRequest(`${USERS_API_URL}/me`, "GET", null, true);
  }
  async followUser(userId: string): Promise<any> {
    return await makeRequest(
      `${FOLLOWS_API_URL}?userId=${userId}`,
      "POST",
      null,
      true
    );
  }

  async blockUser(userId: string): Promise<any> {
    return await makeRequest(`${BLOCK_USER}${userId}`, "POST", null, true);
  }

  async unblockUser(userId: string): Promise<any> {
    return await makeRequest(`${UNBLOCK_USER}${userId}`, "DELETE", null, true);
  }

  async unfollowUser(userId: string): Promise<any> {
    return await makeRequest(
      `${FOLLOWS_API_URL}/${userId}`,
      "DELETE",
      null,
      true
    );
  }

  async deletePost(postId: string): Promise<any> {
    return makeRequest(`${POSTS_API_URL}/${postId}`, "DELETE", null, true);
  }

  async updatePost(postId: string, description: string): Promise<any> {
    return makeRequest(
      `${POSTS_API_URL}/${postId}`,
      "PATCH",
      { description },
      true
    );
  }

  async likePost(postId: string): Promise<any> {
    return await makeRequest(`likes/${postId}`, "POST", null, true);
  }

  async unlikePost(postId: string): Promise<any> {
    return await makeRequest(`likes/${postId}`, "DELETE", null, true);
  }

  async createComment(postId: string, comment: string): Promise<any> {
    return await makeRequest(`comments/${postId}`, "POST", { comment }, true);
  }

  async getPostComments(postId: string): Promise<any> {
    return await makeRequest(`comments/post/${postId}`, "GET", null, true);
  }

  async editComments(commentId: string, comment: string): Promise<any> {
    return await makeRequest(
      `comments/${commentId}`,
      "PATCH",
      { comment },
      true
    );
  }

  async deleteComment(commentId: string): Promise<any> {
    return await makeRequest(`comments/${commentId}`, "DELETE", null, true);
  }
}

export default new ApiService();

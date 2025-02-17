export interface Post {
  id: string;
  description: string;
  owned: boolean;
  images: {
    url: string;
  }[];
  user: {
    id: string;
    username: string;
    profileImage: string | null;
  };
  _count?: {
    Likes?: number;
    comments?: number;
  };
  comments?: Comment[];
  isLiked: boolean;
}

export interface Comment {
  id: string;
  content: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    profileImage: string | null;
  };
}

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
}

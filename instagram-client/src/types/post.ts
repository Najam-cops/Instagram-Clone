export interface Post {
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

export interface PostsResponse {
  posts: Post[];
  nextCursor: string | null;
}

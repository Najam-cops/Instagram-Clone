import React, { useEffect, useState, useCallback } from "react";
import { Box, Card, CardHeader, CardContent, Skeleton } from "@mui/material";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import ApiService from "../../services/apiServices";
import { Post } from "../types/post";
import { useAuth } from "../context/AuthContext";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const loadPosts = useCallback(async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPosts();
      setPosts(response.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  const updatePost = (updatedPost: Post) => {
    setPosts((currentPosts) =>
      currentPosts.map((post) =>
        post.id === updatedPost.id ? updatedPost : post
      )
    );
  };

  const deletePost = (postId: string) => {
    setPosts((currentPosts) =>
      currentPosts.filter((post) => post.id !== postId)
    );
  };

  const refreshPosts = () => {
    setPosts([]);
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, [user?.id]);

  const PostSkeleton = () => (
    <Card className="max-w-[670px] mx-auto border border-[#DBDBDB] rounded-lg shadow-none bg-white">
      <CardHeader
        avatar={<Skeleton variant="circular" width={40} height={40} />}
        title={<Skeleton variant="text" width={120} />}
      />
      <Skeleton variant="rectangular" height={400} />
      <CardContent>
        <Box sx={{ pt: 0.5 }}>
          <Skeleton width="60%" />
          <Skeleton width="80%" />
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-7 gap-8 max-w-6xl">
        <div className="md:col-span-5 w-full mx-auto">
          {isAuthenticated && <CreatePost onPostCreated={refreshPosts} />}
          <div className="space-y-4">
            {loading ? (
              <>
                <PostSkeleton />
                <PostSkeleton />
                <PostSkeleton />
              </>
            ) : (
              posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  refreshPost={refreshPosts}
                  updatePost={updatePost}
                  onDelete={deletePost}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

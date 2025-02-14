import React, { useEffect, useState, useCallback } from "react";
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  Skeleton,
  Button,
} from "@mui/material";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import RightSidebar from "../components/HomePage/RightSidebar";
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
      <div className="mx-auto px-4 py-4 grid grid-cols-1 lg:grid-cols-12 gap-8 max-w-7xl">
        <div className="lg:col-span-8">
          {isAuthenticated && <CreatePost onPostCreated={refreshPosts} />}

          <div className="space-y-4">
            <div className="flex items-end justify-center">
              <Button onClick={refreshPosts}>Refresh</Button>
            </div>

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
        <div className="hidden lg:block lg:col-span-4">
          <RightSidebar />
        </div>
      </div>
    </div>
  );
};

export default HomePage;

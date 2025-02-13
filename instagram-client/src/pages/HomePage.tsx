import React, { useEffect, useState, useCallback } from "react";
import { CircularProgress, Box } from "@mui/material";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import ApiService from "../../services/apiServices";
import { Post } from "../types/post";
import { useAuth } from "../context/AuthContext";
import LeftSidebar from "../components/HomePage/LeftSidebar";

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

  return (
    <div className="bg-[#FAFAFA] min-h-screen">
      <div className="mx-auto px-4 py-4 grid grid-cols-1 md:grid-cols-7 gap-8 max-w-6xl">
        <div className="md:col-span-5  w-full mx-auto">
          {isAuthenticated && <CreatePost onPostCreated={refreshPosts} />}
          <div className="space-y-4">
            {posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                refreshPost={refreshPosts}
                updatePost={updatePost}
                onDelete={deletePost}
              />
            ))}
            {loading && (
              <Box display="flex" justifyContent="center" my={4}>
                <CircularProgress sx={{ color: "#0095F6" }} />
              </Box>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;

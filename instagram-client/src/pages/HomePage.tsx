import React, { useEffect, useState } from "react";
import { Container, CircularProgress, Box } from "@mui/material";
import PostCard from "../components/PostCard";
import CreatePost from "../components/CreatePost";
import ApiService from "../../services/apiServices";
import { Post } from "../types/post";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";

const HomePage: React.FC = () => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(false);
  const { isAuthenticated } = useAuth();

  const loadPosts = async () => {
    try {
      setLoading(true);
      const response = await ApiService.getPosts();
      setPosts(response.posts);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = () => {
    setPosts([]);
    loadPosts();
  };

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        {isAuthenticated && <CreatePost onPostCreated={refreshPosts} />}
        {posts.map((post) => (
          <div key={post.id}>
            <PostCard post={post} />
          </div>
        ))}
        {loading && (
          <Box display="flex" justifyContent="center" my={4}>
            <CircularProgress />
          </Box>
        )}
      </Container>
    </>
  );
};

export default HomePage;

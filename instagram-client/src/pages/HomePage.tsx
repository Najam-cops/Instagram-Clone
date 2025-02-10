import React, { useEffect, useState, useRef, useCallback } from "react";
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
  const [cursor, setCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef<IntersectionObserver | null>(null);
  const { isAuthenticated } = useAuth();

  // console.log(posts, loading, cursor, hasMore);

  const loadPosts = async (cursorValue?: string) => {
    try {
      setLoading(true);
      const response = await ApiService.getPosts(cursorValue);
      setPosts((prev) =>
        cursorValue ? [...prev, ...response.posts] : response.posts
      );
      setCursor(response.nextCursor);
      setHasMore(!!response.nextCursor);
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const refreshPosts = () => {
    setPosts([]);
    setCursor(null);
    loadPosts();
  };

  const lastPostRef = useCallback(
    (node: HTMLDivElement) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          loadPosts(cursor!);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore, cursor]
  );

  useEffect(() => {
    loadPosts();
  }, []);

  return (
    <>
      <Navbar />

      <Container maxWidth="md" sx={{ py: 4 }}>
        {isAuthenticated && <CreatePost onPostCreated={refreshPosts} />}
        {posts.map((post, index) => (
          <div
            key={post.id}
            ref={index === posts.length - 1 ? lastPostRef : undefined}
          >
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

import { Grid, Grid2 } from "@mui/material";
import PostCard from "../PostCard";
import { Post } from "../../types/post";

interface ProfilePostsProps {
  posts: Post[];
  refreshPosts: () => void;
  updatePost: (post: Post) => void;
  onDelete: (postId: string) => void;
}

export default function ProfilePosts({
  posts,
  refreshPosts,
  updatePost,
  onDelete,
}: ProfilePostsProps) {
  console.log("profile posts", posts);
  if (posts?.length === 0) {
    return <div className="text-center py-8 text-gray-500">No posts yet</div>;
  }

  return (
    <Grid2 container spacing={2}>
      {posts.map((post) => (
        <Grid item xs={12} key={post.id}>
          <PostCard
            post={post}
            refreshPost={refreshPosts}
            updatePost={updatePost}
            onDelete={onDelete}
          />
        </Grid>
      ))}
    </Grid2>
  );
}

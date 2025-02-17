import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Snackbar,
  Alert,
  Menu,
  MenuItem,
  Box,
  InputAdornment,
  Skeleton,
} from "@mui/material";
import { Post } from "../types/post";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router";
import { MoreVert as MoreVertIcon } from "@mui/icons-material";
import apiServices from "../../services/apiServices";
import CommentsDialog from "./HomePage/CommentsDialog";
import Carousel from "./HomePage/Carsoul";
import { useAlert } from "../context/AlertContext";

interface PostCardProps {
  post: Post;
  refreshPost: () => void;
  updatePost: (post: Post) => void;
  onDelete: (postId: string) => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, updatePost, onDelete }) => {
  const [liked, setLiked] = useState(post.isLiked || false);
  const navigate = useNavigate();
  const [likesCommentCount, setLikesCommentCount] = useState(post._count);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDescription, setEditDescription] = useState(post.description);
  const { showAlert } = useAlert();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [comment, setComment] = useState<any>();
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [singleComment, setSingleComment] = useState<any>();

  const getSingleComment = async (postId: string) => {
    try {
      const response = await apiServices.getSingleComment(postId);
      setSingleComment(response);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  };

  useEffect(() => {
    getSingleComment(post.id);
  }, [post.id]);

  const handleLikeClick = async () => {
    const previousLiked = liked;
    const previousCount = likesCommentCount.Likes;

    setLiked(!liked);
    setLikesCommentCount((prev) => ({
      ...prev,
      Likes: prev.Likes + (!liked ? 1 : -1),
    }));

    try {
      if (liked) {
        await apiServices.unlikePost(post.id);
        showAlert("Post unliked successfully", "success");
      } else {
        await apiServices.likePost(post.id);
        showAlert("Post liked successfully", "success");
      }

      const updatedPost = {
        ...post,
        isLiked: !liked,
        _count: {
          ...likesCommentCount,
          Likes: likesCommentCount.Likes + (!liked ? 1 : -1),
        },
      };
      updatePost(updatedPost);
    } catch (error) {
      console.error("Error toggling like:", error);
      setLiked(previousLiked);
      setLikesCommentCount((prev) => ({
        ...prev,
        Likes: previousCount,
      }));
      showAlert("Failed to update like", "error");
    }
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim()) return;

    const newCommentText = comment;
    setSingleComment({ ...singleComment, comment: newCommentText });
    setComment("");

    try {
      const newComment = await apiServices.createComment(
        post.id,
        newCommentText
      );
      setComments((prev) => [...prev, newComment]);

      setLikesCommentCount((prev) => ({
        ...prev,
        comments: prev.comments + 1,
      }));

      const updatedPost = {
        ...post,
        _count: {
          ...likesCommentCount,
          comments: likesCommentCount.comments + 1,
        },
      };
      updatePost(updatedPost);
      showAlert("Comment posted successfully", "success");
    } catch (error) {
      console.error("Error posting comment:", error);
      setComment(newCommentText);
      showAlert("Failed to post comment", "error");
    }
  };

  const loadComments = async () => {
    try {
      setIsLoading(true);
      const fetchedComments = await apiServices.getPostComments(post.id);
      setComments(fetchedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentsClick = () => {
    setCommentsOpen(true);
    loadComments();
  };

  const handleDeleteClick = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (confirmDelete) {
        await apiServices.deletePost(post.id);
        onDelete(post.id);
        showAlert("Post deleted successfully", "success");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
      showAlert("Failed to delete post", "error");
    }
  };

  const handleSaveEdit = async () => {
    try {
      await apiServices.updatePost(post.id, editDescription);
      const updatedPost = {
        ...post,
        description: editDescription,
      };
      updatePost(updatedPost);
      setEditDialogOpen(false);
      showAlert("Post updated successfully", "success");
    } catch (error) {
      console.error("Error updating post:", error);
      showAlert("Failed to update post", "error");
    }
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    setEditDialogOpen(true);
    handleMenuClose();
  };

  const handleDelete = async () => {
    handleMenuClose();
    await handleDeleteClick();
  };

  return (
    <>
      <Card className="max-w-[670px] mx-auto border border-[#DBDBDB] rounded-lg shadow-none bg-white">
        <CardHeader
          avatar={
            <Avatar
              onClick={() => navigate(`/profile/${post.user.id}`)}
              src={post.user.profileImage || undefined}
              alt={post.user.username}
              sx={{ bgcolor: "#0095F6" }}
            />
          }
          action={
            post.owned && (
              <IconButton
                onClick={handleMenuClick}
                sx={{
                  color: "#262626",
                  "&:hover": {
                    color: "#0095F6",
                  },
                }}
              >
                <MoreVertIcon />
              </IconButton>
            )
          }
          title={
            <Typography
              variant="subtitle2"
              className="font-semibold"
              sx={{ color: "#262626" }}
            >
              {post.user.username}
            </Typography>
          }
          sx={{
            borderBottom: "1px solid #DBDBDB",
            "& .MuiCardHeader-title": {
              color: "#262626",
            },
          }}
        />

        <Carousel images={post.images} />

        <Box className="px-4 py-2">
          <Box className="flex gap-3">
            <IconButton
              onClick={handleLikeClick}
              sx={{
                color: liked ? "#ED4956" : "#262626",
                padding: "8px",
              }}
            >
              {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
            <IconButton
              onClick={handleCommentsClick}
              sx={{
                color: "#262626",
                padding: "8px",
              }}
            >
              <ChatBubbleOutlineIcon />
            </IconButton>
          </Box>

          <Typography
            variant="subtitle2"
            className="font-semibold mb-1"
            sx={{ color: "#262626" }}
          >
            {likesCommentCount.Likes} likes
          </Typography>
        </Box>

        <CardContent sx={{ pt: 0 }}>
          <Typography
            variant="body2"
            className="mb-2"
            sx={{ color: "#262626" }}
          >
            <span className="font-semibold mr-2">Description</span>
            {post.description}
          </Typography>
          <div className="space-y-2" onClick={() => setCommentsOpen(true)}>
            <Box className="flex-grow">
              <Typography variant="body2">
                <span className="font-semibold mr-2">
                  {singleComment?.user?.username}
                </span>
                {singleComment?.comment}
              </Typography>
            </Box>
          </div>

          {likesCommentCount.comments > 0 && (
            <Typography
              variant="body2"
              onClick={handleCommentsClick}
              sx={{
                color: "#8E8E8E",
                cursor: "pointer",
                "&:hover": { color: "#262626" },
              }}
            >
              View all {likesCommentCount.comments} comments
            </Typography>
          )}

          <Box
            component="form"
            onSubmit={handleCommentSubmit}
            sx={{
              mt: 2,
              display: "flex",
              borderTop: "1px solid #DBDBDB",
              pt: 2,
            }}
          >
            <TextField
              placeholder="Add a comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              fullWidth
              variant="standard"
              sx={{
                "& .MuiInput-root": {
                  "&:before, &:after": {
                    display: "none",
                  },
                },
              }}
              InputProps={{
                endAdornment: comment && (
                  <InputAdornment position="end">
                    <Button
                      type="submit"
                      sx={{
                        textTransform: "none",
                        color: "#0095F6",
                        "&:hover": {
                          backgroundColor: "transparent",
                          color: "#00376B",
                        },
                      }}
                    >
                      Post
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </CardContent>

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleMenuClose}
          PaperProps={{
            sx: {
              "& .MuiMenuItem-root": {
                color: "#262626",
                "&:hover": {
                  backgroundColor: "#FAFAFA",
                },
              },
            },
          }}
        >
          <MenuItem onClick={handleEdit}>Edit</MenuItem>
          <MenuItem onClick={handleDelete} sx={{ color: "#ED4956" }}>
            Delete
          </MenuItem>
        </Menu>
      </Card>

      <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)}>
        <DialogTitle>Edit Post</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Description"
            fullWidth
            multiline
            rows={4}
            value={editDescription}
            onChange={(e) => setEditDescription(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleSaveEdit} variant="contained" color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <CommentsDialog
        postedById={post.user.id}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        comments={comments}
        setComments={setComments}
        isloading={isLoading}
      />
    </>
  );
};

export default PostCard;

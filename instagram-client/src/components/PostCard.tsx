import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardMedia,
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
} from "@mui/material";
import Carousel from "react-material-ui-carousel";
import { Post } from "../types/post";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import { useNavigate } from "react-router";
import { DeleteForever, Edit } from "@mui/icons-material";
import apiServices from "../../services/apiServices";

interface PostCardProps {
  post: Post;
  refreshPost: () => void;
}

const PostCard: React.FC<PostCardProps> = ({ post, refreshPost }) => {
  const [liked, setLiked] = useState(false);
  const navigate = useNavigate();
  const [likesCount, setLikesCount] = useState(post._count.Likes);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editDescription, setEditDescription] = useState(post.description);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleLikeClick = () => {
    setLiked(!liked);
    setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  };

  const handleDeleteClick = async () => {
    try {
      const confirmDelete = window.confirm("Are you sure you want to delete?");
      if (confirmDelete) {
        await apiServices.deletePost(post.id);
        refreshPost();
      }
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error deleting post", error.message);
      }
    }
  };

  const handleUpdateClick = () => {
    setEditDialogOpen(true);
  };

  const handleCommentClick = () => {
    console.log("Comment clicked");
  };

  const handleSaveEdit = async () => {
    try {
      await apiServices.updatePost(post.id, editDescription);
      setEditDialogOpen(false);
      setShowSuccess(true);
      refreshPost();
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.log("Error updating post", error.message);
      }
    }
  };

  return (
    <>
      <Card className="max-w-[470px] mb-6 mx-auto border border-gray-200 rounded-lg shadow-none">
        <CardHeader
          onClick={() => navigate(`/profile/${post.user.id}`)}
          className="px-4 py-3"
          avatar={
            <Avatar
              src={post.user.profileImage || undefined}
              className="w-8 h-8"
            >
              {post.user.username[0].toUpperCase()}
            </Avatar>
          }
          title={
            <span className="text-sm font-semibold">{post.user.username}</span>
          }
        />
        {post.images.length > 0 && (
          <CardMedia className="relative">
            <Carousel
              autoPlay={false}
              animation="slide"
              indicators={post.images.length > 1}
              navButtonsAlwaysInvisible={post.images.length === 1}
              className="aspect-square"
            >
              {post.images.map((image, index) => (
                <img
                  key={index}
                  src={image.url}
                  alt={post.description || `Post image ${index + 1}`}
                  className="w-full h-[470px] object-cover"
                />
              ))}
            </Carousel>
          </CardMedia>
        )}
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <IconButton onClick={handleLikeClick} className="p-2">
                {liked ? (
                  <FavoriteIcon className="text-red-500" />
                ) : (
                  <FavoriteBorderIcon />
                )}
              </IconButton>
              <IconButton onClick={handleCommentClick} className="p-2">
                <ChatBubbleOutlineIcon />
              </IconButton>
              {post.owned && (
                <>
                  <IconButton className="p-2" onClick={handleDeleteClick}>
                    <DeleteForever />
                  </IconButton>
                  <IconButton className="p-2" onClick={handleUpdateClick}>
                    <Edit />
                  </IconButton>
                </>
              )}
            </div>
          </div>
        </div>
        <CardContent className="px-4 pt-1 pb-3">
          <Typography className="text-sm font-semibold mb-1">
            {likesCount} likes
          </Typography>
          {post.description && (
            <Typography className="text-sm">
              <span className="font-semibold mr-2">{post.user.username}</span>
              {post.description}
            </Typography>
          )}
        </CardContent>
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

      <Snackbar
        open={showSuccess}
        autoHideDuration={3000}
        onClose={() => setShowSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Post updated successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default PostCard;

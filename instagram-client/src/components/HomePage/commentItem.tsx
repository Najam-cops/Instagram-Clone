import React, { useState } from "react";
import {
  Box,
  Avatar,
  Typography,
  IconButton,
  Menu,
  MenuItem,
} from "@mui/material";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import FavoriteIcon from "@mui/icons-material/Favorite";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import apiServices from "../../../services/apiServices";
import EditCommentDialog from "./EditCommentDialog";

interface Comment {
  id: string;
  comment: string;
  user: {
    id: string;
    username: string;
    profileImage?: string;
  };
  createdAt: string;
}

interface CommentItemProps {
  comment: Comment;
  userId: string;
  postedById: string;
  onCommentUpdate: (commentId: string, newComment?: Comment) => void;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  userId,
  postedById,
  onCommentUpdate,
}) => {
  const [isLiked, setIsLiked] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [localComment, setLocalComment] = useState(comment);

  const canEdit = userId == comment.user.id;
  const canDelete = userId == comment.user.id || userId == postedById;

  const handleLikeComment = () => {
    console.log("Toggling like for comment:", comment.id);
    setIsLiked(!isLiked);
  };

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEditClick = () => {
    handleMenuClose();
    setIsEditDialogOpen(true);
  };

  const handleEditComment = async (newContent: string) => {
    const originalComment = { ...localComment };

    // Optimistic update
    setLocalComment((prev) => ({
      ...prev,
      comment: newContent,
    }));
    onCommentUpdate(comment.id, { ...localComment, comment: newContent });

    try {
      const response = await apiServices.editComments(comment.id, newContent);

      if (response.status === 200) {
        console.log("Comment updated successfully");
      }
    } catch (error) {
      console.log("Error updating comment:", error);
      // Revert on failure
      setLocalComment(originalComment);
      onCommentUpdate(comment.id, originalComment);
    }
  };

  const handleDeleteComment = async () => {
    // Store the comment for potential restoration
    const deletedComment = { ...localComment };

    // Optimistic update - remove the comment
    onCommentUpdate(comment.id, undefined);
    handleMenuClose();

    try {
      const response = await apiServices.deleteComment(comment.id);

      if (response.status === 200) {
        console.log("Comment deleted successfully");
      }
    } catch (error) {
      console.log("Error deleting comment:", error);
      // Restore the comment on failure
      onCommentUpdate(comment.id, deletedComment);
    }
  };

  return (
    <Box
      sx={{
        py: 2,
        borderBottom: "1px solid #DBDBDB",
        "&:last-child": { borderBottom: "none" },
      }}
    >
      <Box className="flex items-start gap-2">
        <Avatar
          src={localComment.user.profileImage}
          alt={localComment.user.username}
          sx={{ width: 32, height: 32 }}
        />
        <Box className="flex-grow">
          <Typography variant="body2">
            <span className="font-semibold mr-2">
              {localComment.user.username}
            </span>
            {localComment.comment}
          </Typography>
          <Typography variant="caption" sx={{ color: "#8E8E8E" }}>
            {new Date(localComment.createdAt).toLocaleDateString()}{" "}
            {new Date(localComment.createdAt).toLocaleTimeString()}
          </Typography>
        </Box>
        <Box className="flex items-center">
          <IconButton
            size="small"
            onClick={handleLikeComment}
            sx={{
              color: isLiked ? "#ED4956" : "#262626",
              padding: "4px",
            }}
          >
            {isLiked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
          {(canDelete || canEdit) && (
            <IconButton
              size="small"
              onClick={handleMenuClick}
              sx={{
                color: "#262626",
                padding: "4px",
              }}
            >
              <MoreVertIcon />
            </IconButton>
          )}
        </Box>
      </Box>

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
        {canEdit && <MenuItem onClick={handleEditClick}>Edit</MenuItem>}
        {canDelete && (
          <MenuItem onClick={handleDeleteComment} sx={{ color: "#ED4956" }}>
            Delete
          </MenuItem>
        )}
      </Menu>

      <EditCommentDialog
        open={isEditDialogOpen}
        onClose={() => setIsEditDialogOpen(false)}
        onSave={handleEditComment}
        initialContent={localComment.comment}
      />
    </Box>
  );
};

export default CommentItem;

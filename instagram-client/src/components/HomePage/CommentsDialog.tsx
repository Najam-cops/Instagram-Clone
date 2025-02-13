import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import CommentItem from "./commentItem";
import { useAuth } from "../../context/AuthContext";

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

interface CommentsDialogProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  postedById: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({
  open,
  onClose,
  comments,
  postedById,
  setComments,
}) => {
  const { user, isLoading } = useAuth();

  const handleCommentUpdate = (commentId: string, updatedComment?: Comment) => {
    setComments((prevComments) => {
      if (!updatedComment) {
        return prevComments.filter((comment) => comment.id !== commentId);
      }
      return prevComments.map((comment) =>
        comment.id === commentId ? updatedComment : comment
      );
    });
  };

  if (isLoading || !user) {
    return null;
  }

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid #DBDBDB" }}>
        Comments
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 2 }}>
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              userId={user.id}
              postedById={postedById}
              onCommentUpdate={handleCommentUpdate}
            />
          ))}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;

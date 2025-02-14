import React from "react";
import { Dialog, DialogTitle, DialogContent, Box } from "@mui/material";
import Skeleton from "@mui/material/Skeleton";
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
  Likes: { userId: string }[];
  isLiked: boolean;
  createdAt: string;
}

interface CommentsDialogProps {
  open: boolean;
  onClose: () => void;
  comments: Comment[];
  postedById: string;
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
  isloading: boolean;
}

const CommentsDialog: React.FC<CommentsDialogProps> = ({
  open,
  onClose,
  comments,
  postedById,
  setComments,
  isloading: commentLoading,
}) => {
  const { user, isLoading: userLoading } = useAuth();

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

  const renderSkeletons = () => {
    return Array(3)
      .fill(0)
      .map((_, index) => (
        <Box
          key={index}
          sx={{ display: "flex", alignItems: "center", mb: 2, gap: 2 }}
        >
          <Skeleton variant="circular" width={40} height={40} />
          <Box sx={{ flex: 1 }}>
            <Skeleton variant="text" width={120} />
            <Skeleton variant="text" width="80%" />
          </Box>
        </Box>
      ));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ borderBottom: "1px solid #DBDBDB" }}>
        Comments
      </DialogTitle>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ maxHeight: "60vh", overflowY: "auto", p: 2 }}>
          {userLoading || commentLoading
            ? renderSkeletons()
            : user
            ? comments.map((comment) => (
                <CommentItem
                  key={comment.id}
                  comment={comment}
                  userId={user.id}
                  postedById={postedById}
                  onCommentUpdate={handleCommentUpdate}
                />
              ))
            : null}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CommentsDialog;

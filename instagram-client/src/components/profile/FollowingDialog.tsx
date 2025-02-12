import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
} from "@mui/material";
import { MoreVert } from "@mui/icons-material";

interface Following {
  id: string;
  following: {
    id: string;
    username: string;
    name: string | null;
    profileImage: string | null;
  };
}

type FollowingDialogProps = {
  open: boolean;
  onClose: () => void;
  following: Following[];
};

function FollowingDialog({ open, onClose, following }: FollowingDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Following</DialogTitle>
      <DialogContent>
        <List>
          {following.map((follow) => (
            <ListItem
              key={follow.id}
              secondaryAction={
                <IconButton edge="end">
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={follow.following.profileImage || undefined} />
              </ListItemAvatar>
              <ListItemText
                primary={follow.following.username}
                secondary={follow.following.name}
              />
            </ListItem>
          ))}
          {following.length === 0 && (
            <ListItem>
              <ListItemText primary="Not following anyone" />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default FollowingDialog;

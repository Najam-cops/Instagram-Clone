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

interface Follower {
  id: string;
  follower: {
    id: string;
    username: string;
    name: string | null;
    profileImage: string | null;
  };
}

type FollowersDialogProps = {
  open: boolean;
  onClose: () => void;
  followers: Follower[];
};

function FollowersDialog({ open, onClose, followers }: FollowersDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Followers</DialogTitle>
      <DialogContent>
        <List>
          {followers.map((follow) => (
            <ListItem
              key={follow.id}
              secondaryAction={
                <IconButton edge="end">
                  <MoreVert />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar src={follow.follower.profileImage || undefined} />
              </ListItemAvatar>
              <ListItemText
                primary={follow.follower.username}
                secondary={follow.follower.name}
              />
            </ListItem>
          ))}
          {followers.length === 0 && (
            <ListItem>
              <ListItemText primary="No followers yet" />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default FollowersDialog;

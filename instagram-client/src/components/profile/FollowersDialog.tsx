import {
  Dialog,
  DialogTitle,
  DialogContent,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  Button,
} from "@mui/material";

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
  handleFollow: (followerId: string) => void;
  isOwnProfile: boolean;
};

function FollowersDialog({
  open,
  onClose,
  followers,
  handleFollow,
  isOwnProfile,
}: FollowersDialogProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Followers</DialogTitle>
      <DialogContent>
        <List>
          {followers.map((follow) => (
            <ListItem
              key={follow.id}
              // secondaryAction={
              //   <Button
              //     variant="outlined"
              //     size="small"
              //     onClick={() => handleFollow(follow.follower.id)}
              //   >
              //     Follow Back
              //   </Button>
              // }
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

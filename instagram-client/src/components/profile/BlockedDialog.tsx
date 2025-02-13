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
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router";

interface BlockedDialogProps {
  open: boolean;
  onClose: () => void;
  blocked: any[];
  onUnblock: (userId: string) => void;
}

export default function BlockedDialog({
  open,
  onClose,
  blocked,
  onUnblock,
}: BlockedDialogProps) {
  const navigate = useNavigate();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle className="flex justify-between items-center">
        Blocked Users
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <List>
          {blocked.map((block) => (
            <ListItem
              key={block.blockedBy.id}
              className="flex justify-between items-center"
              secondaryAction={
                <Button
                  variant="outlined"
                  size="small"
                  onClick={() => onUnblock(block.blockedBy.id)}
                >
                  Unblock
                </Button>
              }
            >
              <div
                className="flex items-center gap-3 cursor-pointer"
                onClick={() => {
                  navigate(`/profile/${block.blockedBy.id}`);
                  onClose();
                }}
              >
                <ListItemAvatar>
                  <Avatar
                    src={block.blockedBy.profileImage}
                    alt={block.blockedBy.username}
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={block.blockedBy.username}
                  secondary={block.blockedBy.name}
                />
              </div>
            </ListItem>
          ))}
          {blocked.length === 0 && (
            <ListItem>
              <ListItemText primary="No blocked users" />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

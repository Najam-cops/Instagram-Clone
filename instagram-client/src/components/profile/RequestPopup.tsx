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
import { Check, Close } from "@mui/icons-material";

interface FollowRequest {
  id: string;
  requesterId: string;
  requestedId: string;
  requester: {
    id: string;
    username: string;
    name: string | null;
    profileImage: string | null;
  };
}

type RequestPopupProps = {
  open: boolean;
  onClose: () => void;
  requests: FollowRequest[];
  acceptRequest: (id: string) => void;
  rejectRequest: (id: string) => void;
  isAccepting: boolean;
  isRejecting: boolean;
  isOwnProfile: boolean;
};

function RequestPopup({
  open,
  onClose,
  requests,
  acceptRequest,
  rejectRequest,
  isAccepting,
  isRejecting,
  isOwnProfile,
}: RequestPopupProps) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Follow Requests</DialogTitle>
      <DialogContent>
        <List>
          {requests.map((request) => (
            <ListItem
              key={request.id}
              secondaryAction={
                isOwnProfile && (
                  <div className="flex gap-2">
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => acceptRequest(request.id)}
                      disabled={isAccepting}
                    >
                      <Check />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => rejectRequest(request.id)}
                      disabled={isRejecting}
                    >
                      <Close />
                    </IconButton>
                  </div>
                )
              }
            >
              <ListItemAvatar>
                <Avatar src={request.requester.profileImage || undefined} />
              </ListItemAvatar>
              <ListItemText
                primary={request.requester.username}
                secondary={request.requester.name}
              />
            </ListItem>
          ))}
          {requests.length === 0 && (
            <ListItem>
              <ListItemText primary="No pending requests" />
            </ListItem>
          )}
        </List>
      </DialogContent>
    </Dialog>
  );
}

export default RequestPopup;

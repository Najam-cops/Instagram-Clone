import { useParams, useNavigate } from "react-router";
import { useUserDetails } from "../hooks/useUserDetails";
import {
  Avatar,
  Button,
  CircularProgress,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Check, Close, MoreVert } from "@mui/icons-material";
import { useAuth } from "../context/AuthContext";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div role="tabpanel" hidden={value !== index} {...other} className="mt-4">
      {value === index && children}
    </div>
  );
}

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(0);
  const [openRequestsDialog, setOpenRequestsDialog] = useState(false);
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);

  // If no ID is provided, use the current user's ID
  const profileId = id || currentUser?.id;

  // Redirect to signin if no current user
  useEffect(() => {
    if (!currentUser) {
      navigate("/signin");
    }
  }, [currentUser, navigate]);

  const {
    userDetails,
    requests,
    followers,
    following,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    deleteRequest,
  } = useUserDetails(profileId || "");

  if (!currentUser) {
    return null; // Don't render anything while redirecting
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error || !userDetails) {
    return (
      <div className="text-center text-red-500 mt-4">
        {error || "User not found"}
      </div>
    );
  }

  const isOwnProfile = currentUser.id === userDetails.id;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-start gap-8">
        {/* Profile Header */}
        <div className="flex-shrink-0">
          <Avatar
            src={userDetails.profileImage || undefined}
            alt={userDetails.username}
            sx={{ width: 150, height: 150 }}
          />
        </div>

        <div className="flex-grow">
          <div className="flex items-center gap-4 mb-4">
            <h1 className="text-2xl font-bold">{userDetails.username}</h1>
            {isOwnProfile && (
              <Button variant="outlined" size="small">
                Edit Profile
              </Button>
            )}
          </div>

          <div className="flex gap-6 mb-4">
            <button
              onClick={() => setOpenFollowersDialog(true)}
              className="text-sm hover:underline"
            >
              <span className="font-bold">{followers.length}</span> followers
            </button>
            <button
              onClick={() => setOpenFollowingDialog(true)}
              className="text-sm hover:underline"
            >
              <span className="font-bold">{following.length}</span> following
            </button>
            {isOwnProfile && (
              <button
                onClick={() => setOpenRequestsDialog(true)}
                className="text-sm hover:underline"
              >
                <span className="font-bold">{requests.length}</span> requests
              </button>
            )}
          </div>

          <div>
            <h2 className="font-bold">{userDetails.name}</h2>
          </div>
        </div>
      </div>

      {/* Tabs Section */}
      <div className="mt-8">
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          centered
        >
          <Tab label="Posts" />
          <Tab label="Tagged" />
        </Tabs>

        <TabPanel value={activeTab} index={0}>
          <div className="grid grid-cols-3 gap-4">
            {/* Posts grid will go here */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              No posts yet
            </div>
          </div>
        </TabPanel>

        <TabPanel value={activeTab} index={1}>
          <div className="grid grid-cols-3 gap-4">
            {/* Tagged posts will go here */}
            <div className="aspect-square bg-gray-100 flex items-center justify-center">
              No tagged posts
            </div>
          </div>
        </TabPanel>
      </div>

      {/* Requests Dialog */}
      <Dialog
        open={openRequestsDialog}
        onClose={() => setOpenRequestsDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Follow Requests</DialogTitle>
        <DialogContent>
          <List>
            {requests.map((request) => (
              <ListItem
                key={request.id}
                secondaryAction={
                  <div className="flex gap-2">
                    <IconButton
                      edge="end"
                      color="primary"
                      onClick={() => acceptRequest(request.id)}
                    >
                      <Check />
                    </IconButton>
                    <IconButton
                      edge="end"
                      color="error"
                      onClick={() => rejectRequest(request.id)}
                    >
                      <Close />
                    </IconButton>
                  </div>
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

      {/* Followers Dialog */}
      <Dialog
        open={openFollowersDialog}
        onClose={() => setOpenFollowersDialog(false)}
        maxWidth="sm"
        fullWidth
      >
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

      {/* Following Dialog */}
      <Dialog
        open={openFollowingDialog}
        onClose={() => setOpenFollowingDialog(false)}
        maxWidth="sm"
        fullWidth
      >
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
    </div>
  );
}

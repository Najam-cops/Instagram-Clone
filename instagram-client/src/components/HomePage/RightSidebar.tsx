import { useState, useEffect } from "react";
import {
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import apiServices from "../../../services/apiServices";
import { useAlert } from "../../context/AlertContext";

interface User {
  id: string;
  username: string;
  name: string;
  profileImage: string | null;
  requestSent: boolean;
  isPrivate: boolean | null;
}

export default function RightSidebar() {
  const { user } = useAuth();
  const [suggestedUsers, setSuggestedUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [followingInProgress, setFollowingInProgress] = useState<string[]>([]);
  const { showAlert } = useAlert();

  useEffect(() => {
    if (searchQuery) {
      searchUsers(searchQuery);
    } else {
      loadSuggestedUsers();
    }
  }, [searchQuery]);

  const loadSuggestedUsers = async () => {
    try {
      setLoading(true);
      const response = await apiServices.getUsers(7, "");
      setSuggestedUsers(response || []);
    } catch (error) {
      showAlert("Error Loading Suggested Users", "error");
      console.error("Error loading suggested users:", error);
      setSuggestedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const searchUsers = async (query: string) => {
    if (!query) return;
    try {
      setLoading(true);
      const response = await apiServices.getUsers(7, query);
      setSuggestedUsers(response || []);
    } catch (error) {
      showAlert("Error Searching Users", "error");
      console.error("Error searching users:", error);
      setSuggestedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleFollow = async (userId: string) => {
    try {
      setFollowingInProgress((prev) => [...prev, userId]);

      const response = await apiServices.followUser(userId);
      setSuggestedUsers((users) => users.filter((user) => user.id !== userId));
      showAlert(response.message || "You have followed the user", "success");
    } catch (error: any) {
      showAlert(
        error?.response?.data?.message || "Error Following user",
        "error"
      );

      console.error("Error following user:", error);
    } finally {
      setFollowingInProgress((prev) => prev.filter((id) => id !== userId));
    }
  };

  const UserItem = ({ user: suggestedUser }: { user: User }) => {
    const isLoading = followingInProgress.includes(suggestedUser.id);

    return (
      <div className="flex items-center justify-between mb-3 p-2 hover:bg-gray-50 rounded-lg">
        <div className="flex items-center gap-2">
          <Avatar
            src={suggestedUser.profileImage || undefined}
            sx={{ width: 32, height: 32 }}
          />
          <div>
            <Typography variant="subtitle2" className="text-sm">
              {suggestedUser.username}
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-xs"
            >
              {suggestedUser.name}
            </Typography>
          </div>
        </div>
        <Button
          size="small"
          variant="contained"
          onClick={() => handleFollow(suggestedUser.id)}
          disabled={isLoading || suggestedUser.requestSent}
          sx={{ minWidth: 80 }}
        >
          {isLoading ? (
            <CircularProgress size={20} />
          ) : suggestedUser.requestSent ? (
            "Requested"
          ) : (
            "Follow"
          )}
        </Button>
      </div>
    );
  };

  const UserSkeleton = () => (
    <div className="flex items-center justify-between mb-3 p-2">
      <div className="flex items-center gap-2">
        <Skeleton variant="circular" width={32} height={32} />
        <div>
          <Skeleton variant="text" width={100} height={20} />
          <Skeleton variant="text" width={80} height={16} />
        </div>
      </div>
      <Skeleton variant="rectangular" width={80} height={30} />
    </div>
  );

  return (
    <Paper className="p-4 sticky top-20">
      <div className="flex items-center gap-3 mb-6">
        <Avatar
          src={user?.profileImage || undefined}
          alt={user?.username || "User"}
        />
        <div>
          <Typography variant="subtitle2" className="font-semibold">
            {user?.username}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user?.name}
          </Typography>
        </div>
      </div>

      <div className="space-y-4">
        <TextField
          fullWidth
          size="small"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          variant="outlined"
        />

        <div>
          <Typography
            variant="subtitle2"
            color="text.secondary"
            className="mb-4"
          >
            {searchQuery ? "Search Results" : "Some users for you to follow"}
          </Typography>

          {loading ? (
            <>
              <UserSkeleton />
              <UserSkeleton />
              <UserSkeleton />
              <UserSkeleton />
              <UserSkeleton />
            </>
          ) : suggestedUsers.length > 0 ? (
            suggestedUsers.map((suggestedUser) => (
              <UserItem key={suggestedUser.id} user={suggestedUser} />
            ))
          ) : (
            <Typography
              variant="body2"
              color="text.secondary"
              className="text-center py-4"
            >
              {searchQuery ? "No users found" : "No suggestions available"}
            </Typography>
          )}
        </div>
      </div>
    </Paper>
  );
}

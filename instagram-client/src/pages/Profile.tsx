import { useParams, useNavigate } from "react-router";
import { useUserDetails } from "../hooks/UserUserDetails";
import { useFollowRequests } from "../hooks/useFollowRequests";
import { Avatar, Button, CircularProgress, Grid } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import FollowersDialog from "../components/profile/FollowersDialog";
import FollowingDialog from "../components/profile/FollowingDialog";
import RequestPopup from "../components/profile/RequestPopup";
import BlockedDialog from "../components/profile/BlockedDialog";
import ProfileSidebar from "../components/profile/ProfileSidebar";
import ProfilePosts from "../components/profile/ProfilePosts";
import apiServices from "../../services/apiServices";
import LockIcon from "@mui/icons-material/Lock";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, isLoading: userLoading } = useAuth();
  const navigate = useNavigate();
  const [openRequestsDialog, setOpenRequestsDialog] = useState(false);
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
  const [openBlockedDialog, setOpenBlockedDialog] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [activeTab, setActiveTab] = useState("posts");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileId = id || currentUser?.id;

  useEffect(() => {
    if (!currentUser && !userLoading) {
      navigate("/signin");
    }
  }, [currentUser, navigate, userLoading]);

  const {
    userDetails,
    requests,
    followers,
    following,
    blocked,
    posts,
    loading,
    error,
    refreshData,
  } = useUserDetails(profileId || "");

  const { acceptRequest, rejectRequest, isAccepting, isRejecting } =
    useFollowRequests(profileId || "");

  const handleImageClick = () => {
    if (isOwnProfile) {
      fileInputRef.current?.click();
    }
  };

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;

    try {
      const response = await apiServices.changeProfileImage(
        file,
        currentUser.id
      );

      if (!response.sucess) {
        throw new Error("Failed to upload image");
      }

      refreshData();
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFollow = async () => {
    try {
      await apiServices.followUser(userDetails.id);
      refreshData();
    } catch (error) {
      console.error("Error following user:", error);
      alert("Failed to follow user. Please try again.");
    }
  };

  const handleBlock = async () => {
    try {
      await apiServices.blockUser(userDetails.id);
      refreshData();
    } catch (error) {
      console.error("Error blocking user:", error);
      alert("Failed to block user. Please try again.");
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await apiServices.unblockUser(userId);
      refreshData();
    } catch (error) {
      console.error("Error unblocking user:", error);
      alert("Failed to unblock user. Please try again.");
    }
  };

  const handleUnfollow = async () => {
    try {
      await apiServices.unfollowUser(userDetails.id);
      refreshData();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      alert("Failed to unfollow user. Please try again.");
    }
  };

  const handlePostDelete = async (postId: string) => {
    try {
      await apiServices.deletePost(postId);
      refreshData();
    } catch (error) {
      console.error("Error deleting post:", error);
      alert("Failed to delete post. Please try again.");
    }
  };

  const handlePostUpdate = (updatedPost: any) => {
    refreshData();
  };

  if (!currentUser) return null;

  if (loading || userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
            <div className="relative">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileSelect}
                disabled={isUploading}
              />
              <div
                className={`relative cursor-pointer ${
                  isOwnProfile ? "hover:opacity-90" : ""
                }`}
                onClick={handleImageClick}
              >
                <Avatar
                  src={userDetails.profileImage || undefined}
                  alt={userDetails.username}
                  sx={{
                    width: 150,
                    height: 150,
                  }}
                />
                {isOwnProfile && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity rounded-full">
                    <span className="text-white text-sm">Change photo</span>
                  </div>
                )}
                {isUploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-90 rounded-full">
                    <CircularProgress color="primary" size={24} />
                  </div>
                )}
              </div>
            </div>

            <div className="flex-grow space-y-4 text-center md:text-left">
              <div className="flex flex-col md:flex-row items-center gap-4">
                <div className="flex items-center gap-2">
                  <h1 className="text-2xl font-bold">{userDetails.username}</h1>
                  {userDetails.isPrivate && (
                    <LockIcon className="text-gray-500" fontSize="small" />
                  )}
                </div>
                {isOwnProfile ? (
                  <Button variant="outlined" size="small">
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    {userDetails.isBlocked ? (
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleUnblock(userDetails.id)}
                      >
                        Unblock
                      </Button>
                    ) : (
                      <>
                        {userDetails.isFollowing ? (
                          <Button
                            variant="outlined"
                            size="small"
                            color="primary"
                            onClick={handleUnfollow}
                          >
                            Unfollow
                          </Button>
                        ) : userDetails.isFollower ? (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={handleFollow}
                          >
                            Follow Back
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            size="small"
                            color="primary"
                            onClick={handleFollow}
                          >
                            Follow
                          </Button>
                        )}
                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={handleBlock}
                        >
                          Block
                        </Button>
                      </>
                    )}
                  </div>
                )}
              </div>

              <div>
                <h2 className="font-medium">{userDetails.name}</h2>
                {userDetails.bio && (
                  <p className="text-gray-600 mt-2">{userDetails.bio}</p>
                )}
              </div>
            </div>
          </div>
        </Grid>

        {!userDetails.isPrivateAndNotFollowing && (
          <>
            <Grid item xs={12} md={3}>
              <ProfileSidebar
                isOwnProfile={isOwnProfile}
                followers={followers}
                following={following}
                requests={requests}
                blocked={blocked}
                posts={posts}
                onOpenFollowers={() => setOpenFollowersDialog(true)}
                onOpenFollowing={() => setOpenFollowingDialog(true)}
                onOpenRequests={() => setOpenRequestsDialog(true)}
                onOpenBlocked={() => setOpenBlockedDialog(true)}
                activeTab={activeTab}
                setActiveTab={setActiveTab}
              />
            </Grid>

            <Grid item xs={12} md={9}>
              <ProfilePosts
                posts={posts}
                refreshPosts={refreshData}
                updatePost={handlePostUpdate}
                onDelete={handlePostDelete}
              />
            </Grid>
          </>
        )}
      </Grid>

      <FollowersDialog
        open={openFollowersDialog}
        onClose={() => setOpenFollowersDialog(false)}
        followers={followers}
      />

      <FollowingDialog
        open={openFollowingDialog}
        onClose={() => setOpenFollowingDialog(false)}
        following={following}
      />

      <RequestPopup
        open={openRequestsDialog}
        onClose={() => setOpenRequestsDialog(false)}
        requests={requests}
        acceptRequest={acceptRequest}
        rejectRequest={rejectRequest}
        isAccepting={isAccepting}
        isRejecting={isRejecting}
      />

      <BlockedDialog
        open={openBlockedDialog}
        onClose={() => setOpenBlockedDialog(false)}
        blocked={blocked}
        onUnblock={handleUnblock}
      />
    </div>
  );
}

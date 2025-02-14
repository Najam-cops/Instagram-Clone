import { useParams, useNavigate } from "react-router";
import { useUserDetails } from "../hooks/UserUserDetails";
import { useFollowRequests } from "../hooks/useFollowRequests";
import {
  Avatar,
  Button,
  CircularProgress,
  Grid,
  Skeleton,
} from "@mui/material";
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
import { useAlert } from "../context/AlertContext";

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
  const { showAlert } = useAlert();
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

  const handlePrivacyChange = async () => {
    try {
      await apiServices.togglePrivateAccount();
      showAlert("Privacy settings updated", "success");
      refreshData();
    } catch (error) {
      showAlert("Failed to update privacy settings", "error");
      console.error("Error updating privacy settings:", error);
    }
  };
  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsUploading(true);
    const file = event.target.files?.[0];
    if (!file || !currentUser) return;
    if (file.size > 1 * 1024 * 1024) {
      showAlert("Image size should be less than 1MB", "error");
      setIsUploading(false);
      return;
    }

    try {
      const response = await apiServices.changeProfileImage(
        file,
        currentUser.id
      );

      if (!response.sucess) {
        throw new Error("Failed to upload image");
      }

      showAlert("Profile image updated", "success");

      refreshData();
    } catch (error) {
      showAlert("Failed to upload profile image", "error");
      console.error("Error uploading profile image:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleFollow = async (id?: string) => {
    try {
      const userId = id || userDetails.id;
      await apiServices.followUser(userId);
      showAlert("User followed", "success");
      refreshData();
    } catch (error) {
      console.error("Error following user:", error);
      showAlert("Failed to follow user", "error");
    }
  };

  const handleBlock = async () => {
    try {
      await apiServices.blockUser(userDetails.id);
      showAlert("User blocked", "success");
      refreshData();
    } catch (error) {
      console.error("Error blocking user:", error);
      showAlert("Failed to block user", "error");
    }
  };

  const handleUnblock = async (userId: string) => {
    try {
      await apiServices.unblockUser(userId);
      showAlert("User unblocked", "success");
      refreshData();
    } catch (error) {
      console.error("Error unblocking user:", error);
      showAlert("Failed to unblock user", "error");
    }
  };

  const handleUnfollow = async (id?: string) => {
    try {
      const userId = id || userDetails?.id;
      if (!userId) throw new Error("User ID is required to unfollow");
      await apiServices.unfollowUser(userId);
      showAlert("User unfollowed", "success");
      refreshData();
    } catch (error) {
      console.error("Error unfollowing user:", error);
      showAlert("Failed to unfollow user", "error");
    }
  };

  const handlePostDelete = async (postId: string) => {
    try {
      await apiServices.deletePost(postId);
      showAlert("Post deleted", "success");
      refreshData();
    } catch (error) {
      console.error("Error deleting post:", error);
      showAlert("Failed to delete post", "error");
    }
  };

  const handlePostUpdate = (updatedPost: any) => {
    refreshData();
  };

  if (!currentUser) return null;

  if (userLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <CircularProgress />
      </div>
    );
  }

  if (error?.userDetails || !userDetails) {
    return (
      <div className="text-center text-red-500 mt-4">
        <CircularProgress />
      </div>
    );
  }

  const isOwnProfile = currentUser.id === userDetails.id;

  const ProfileHeaderSkeleton = () => (
    <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
      <Skeleton variant="circular" width={150} height={150} />
      <div className="flex-grow space-y-4">
        <div className="flex items-center gap-2">
          <Skeleton variant="text" width={200} height={32} />
        </div>
        <Skeleton variant="text" width={150} />
        <Skeleton variant="text" width={300} />
      </div>
    </div>
  );

  const ProfileStatsSkeleton = () => (
    <div className="flex gap-4">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} variant="rectangular" width={100} height={50} />
      ))}
    </div>
  );

  const PostsSkeleton = () => (
    <div className="grid grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <Skeleton key={i} variant="rectangular" width="100%" height={200} />
      ))}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Grid container spacing={4}>
        <Grid item xs={12}>
          {loading.userDetails ? (
            <ProfileHeaderSkeleton />
          ) : (
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
                    <h1 className="text-2xl font-bold">
                      {userDetails.username}
                    </h1>
                    {userDetails.isPrivate && (
                      <LockIcon className="text-gray-500" fontSize="small" />
                    )}
                  </div>
                  {isOwnProfile ? (
                    <>
                      {userDetails.isPrivate && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={handlePrivacyChange}
                        >
                          Make Profile Public
                        </Button>
                      )}

                      {!userDetails.isPrivate && (
                        <Button
                          variant="outlined"
                          size="small"
                          color="primary"
                          onClick={handlePrivacyChange}
                        >
                          Make Profile Private
                        </Button>
                      )}
                    </>
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
          )}
        </Grid>

        {!userDetails.isPrivateAndNotFollowing && (
          <>
            <Grid item xs={12} md={3}>
              {loading.followers || loading.following || loading.requests ? (
                <ProfileStatsSkeleton />
              ) : (
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
              )}
            </Grid>

            <Grid item xs={12} md={9}>
              {loading.posts ? (
                <PostsSkeleton />
              ) : (
                <ProfilePosts
                  posts={posts}
                  refreshPosts={refreshData}
                  updatePost={handlePostUpdate}
                  onDelete={handlePostDelete}
                />
              )}
            </Grid>
          </>
        )}
      </Grid>

      <FollowersDialog
        open={openFollowersDialog}
        onClose={() => setOpenFollowersDialog(false)}
        followers={followers}
        handleFollow={handleFollow}
      />

      <FollowingDialog
        open={openFollowingDialog}
        onClose={() => setOpenFollowingDialog(false)}
        following={following}
        handleUnfollow={handleUnfollow}
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

import { useParams, useNavigate } from "react-router";
import { useUserDetails } from "../hooks/useUserDetails";
import { useFollowRequests } from "../hooks/useFollowRequests";
import { Avatar, Button, CircularProgress } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import FollowersDialog from "../components/profile/FollowersDialog";
import FollowingDialog from "../components/profile/FollowingDialog";
import RequestPopup from "../components/profile/RequestPopup";
import apiServices from "../../services/apiServices";

export default function Profile() {
  const { id } = useParams();
  const { user: currentUser, isLoading: userLoading } = useAuth();
  const navigate = useNavigate();
  const [openRequestsDialog, setOpenRequestsDialog] = useState(false);
  const [openFollowersDialog, setOpenFollowersDialog] = useState(false);
  const [openFollowingDialog, setOpenFollowingDialog] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileId = id || currentUser?.id;

  useEffect(() => {
    if (!currentUser && !userLoading) {
      navigate("/signin");
    }
  }, [currentUser, navigate, userLoading]);

  const { userDetails, requests, followers, following, loading, error } =
    useUserDetails(profileId || "");

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

      window.location.reload();
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile image. Please try again.");
    }
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
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
        <div className="relative">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileSelect}
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
          </div>
        </div>

        <div className="flex-grow space-y-4 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <h1 className="text-2xl font-bold">{userDetails.username}</h1>
            {isOwnProfile && (
              <Button variant="outlined" size="small">
                Edit Profile
              </Button>
            )}
          </div>

          <div className="flex justify-center md:justify-start gap-6">
            <button
              onClick={() => setOpenFollowersDialog(true)}
              className="hover:opacity-75 transition-opacity"
            >
              <span className="font-bold">{followers.length}</span>{" "}
              <span className="text-gray-600">followers</span>
            </button>
            <button
              onClick={() => setOpenFollowingDialog(true)}
              className="hover:opacity-75 transition-opacity"
            >
              <span className="font-bold">{following.length}</span>{" "}
              <span className="text-gray-600">following</span>
            </button>
            {isOwnProfile && requests.length >= 0 && (
              <button
                onClick={() => setOpenRequestsDialog(true)}
                className="hover:opacity-75 transition-opacity"
              >
                <span className="font-bold text-blue-500">
                  {requests.length}
                </span>{" "}
                <span className="text-gray-600">requests</span>
              </button>
            )}
          </div>

          <div>
            <h2 className="font-medium">{userDetails.name}</h2>
          </div>
        </div>
      </div>

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
    </div>
  );
}

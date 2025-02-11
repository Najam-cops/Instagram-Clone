import { useState, useEffect } from "react";
import ApiService from "../../services/apiServices";

interface UserDetails {
  id: string;
  email: string;
  name: string | null;
  profileImage: string | null;
  username: string;
  isPrivate: boolean;
}

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

interface Follower {
  id: string;
  follower: {
    id: string;
    username: string;
    name: string | null;
    profileImage: string | null;
  };
}

interface Following {
  id: string;
  following: {
    id: string;
    username: string;
    name: string | null;
    profileImage: string | null;
  };
}

export const useUserDetails = (userId: string) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [requests, setRequests] = useState<FollowRequest[]>([]);
  const [followers, setFollowers] = useState<Follower[]>([]);
  const [following, setFollowing] = useState<Following[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUserDetails = async () => {
    try {
      const data = await ApiService.getUserDetails(userId);
      setUserDetails(data);
    } catch (err) {
      setError("Failed to fetch user details");
      console.error(err);
    }
  };

  const fetchRequests = async () => {
    try {
      const data = await ApiService.getUserRequests(userId);
      setRequests(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFollowers = async () => {
    try {
      const data = await ApiService.getUserFollowers(userId);
      setFollowers(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchFollowing = async () => {
    try {
      const data = await ApiService.getUserFollowing(userId);
      setFollowing(data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      await Promise.all([
        fetchUserDetails(),
        fetchRequests(),
        fetchFollowers(),
        fetchFollowing(),
      ]);
      setLoading(false);
    };

    if (userId) {
      fetchAll();
    }
  }, [userId]);

  const acceptRequest = async (requestId: string) => {
    try {
      await ApiService.acceptFollowRequest(requestId);
      // Refresh the requests and followers lists
      await Promise.all([fetchRequests(), fetchFollowers()]);
    } catch (err) {
      setError("Failed to accept request");
      console.error(err);
    }
  };

  const rejectRequest = async (requestId: string) => {
    try {
      await ApiService.rejectFollowRequest(requestId);
      // Refresh the requests list
      await fetchRequests();
    } catch (err) {
      setError("Failed to reject request");
      console.error(err);
    }
  };

  const deleteRequest = async (requestId: string) => {
    try {
      await ApiService.deleteFollowRequest(requestId);
      // Refresh the requests list
      await fetchRequests();
    } catch (err) {
      setError("Failed to delete request");
      console.error(err);
    }
  };

  const refreshData = () => {
    fetchUserDetails();
    fetchRequests();
    fetchFollowers();
    fetchFollowing();
  };

  return {
    userDetails,
    requests,
    followers,
    following,
    loading,
    error,
    acceptRequest,
    rejectRequest,
    deleteRequest,
    refreshData,
  };
};

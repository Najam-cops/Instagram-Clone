import { useQueries, useQueryClient } from "@tanstack/react-query";
import ApiService from "../../services/apiServices";

export const useUserDetails = (userId: string) => {
  const queryClient = useQueryClient();

  const [
    userDetailsQuery,
    requestsQuery,
    followersQuery,
    followingQuery,
    blockedQuery,
    postsQuery,
  ] = useQueries({
    queries: [
      {
        queryKey: ["user-details", userId, "profile"],
        queryFn: () => ApiService.getUserDetails(userId),
      },
      {
        queryKey: ["user-details", userId, "requests"],
        queryFn: () => ApiService.getUserRequests(userId),
      },
      {
        queryKey: ["user-details", userId, "followers"],
        queryFn: () => ApiService.getUserFollowers(userId),
      },
      {
        queryKey: ["user-details", userId, "following"],
        queryFn: () => ApiService.getUserFollowing(userId),
      },
      {
        queryKey: ["user-details", userId, "blocked"],
        queryFn: () => ApiService.getUserBlocked(userId),
      },
      {
        queryKey: ["user-details", userId, "posts"],
        queryFn: () => ApiService.getUserPosts(),
      },
    ],
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["user-details", userId] });
  };

  console.log("user details", postsQuery.data);

  return {
    userDetails: userDetailsQuery.data ?? null,
    requests: requestsQuery.data ?? [],
    followers: followersQuery.data ?? [],
    following: followingQuery.data ?? [],
    blocked: blockedQuery.data ?? [],
    posts: postsQuery.data ?? [],
    loading: {
      userDetails: userDetailsQuery.isLoading,
      requests: requestsQuery.isLoading,
      followers: followersQuery.isLoading,
      following: followingQuery.isLoading,
      blocked: blockedQuery.isLoading,
      posts: postsQuery.isLoading,
    },
    error: {
      userDetails: userDetailsQuery.error,
      requests: requestsQuery.error,
      followers: followersQuery.error,
      following: followingQuery.error,
      blocked: blockedQuery.error,
      posts: postsQuery.error,
    },
    refreshData,
  };
};

import { useQuery, useQueryClient } from "@tanstack/react-query";
import ApiService from "../../services/apiServices";

export const useUserDetails = (userId: string) => {
  const queryClient = useQueryClient();

  const { data, isError, isLoading, error } = useQuery({
    queryKey: ["user-details", userId],
    queryFn: async () => {
      const userDetails = await ApiService.getUserDetails(userId);
      const requests = await ApiService.getUserRequests(userId);
      const followers = await ApiService.getUserFollowers(userId);
      const following = await ApiService.getUserFollowing(userId);
      return { userDetails, requests, followers, following };
    },
  });

  const refreshData = () => {
    queryClient.invalidateQueries({ queryKey: ["user-details", userId] });
  };

  return {
    userDetails: data?.userDetails ?? null,
    requests: data?.requests ?? [],
    followers: data?.followers ?? [],
    following: data?.following ?? [],
    loading: isLoading,
    error: isError ? error : null,
    refreshData,
  };
};

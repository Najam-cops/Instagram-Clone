import { useMutation, useQueryClient } from "@tanstack/react-query";
import ApiService from "../../services/apiServices";

export const useFollowRequests = (userId: string) => {
  const queryClient = useQueryClient();

  const acceptRequestMutation = useMutation({
    mutationFn: (requestId: string) =>
      ApiService.acceptFollowRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details", userId] });
    },
    onError: (error) => {
      console.error("Failed to accept request:", error);
    },
  });

  const rejectRequestMutation = useMutation({
    mutationFn: (requestId: string) =>
      ApiService.rejectFollowRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details", userId] });
    },
    onError: (error) => {
      console.error("Failed to reject request:", error);
    },
  });

  const deleteRequestMutation = useMutation({
    mutationFn: (requestId: string) =>
      ApiService.deleteFollowRequest(requestId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user-details", userId] });
    },
    onError: (error) => {
      console.error("Failed to delete request:", error);
    },
  });

  return {
    acceptRequest: (requestId: string) =>
      acceptRequestMutation.mutate(requestId),
    rejectRequest: (requestId: string) =>
      rejectRequestMutation.mutate(requestId),
    deleteRequest: (requestId: string) =>
      deleteRequestMutation.mutate(requestId),
    isAccepting: acceptRequestMutation.isPending,
    isRejecting: rejectRequestMutation.isPending,
    isDeleting: deleteRequestMutation.isPending,
  };
};

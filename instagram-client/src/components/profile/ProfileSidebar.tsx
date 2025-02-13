import { useNavigate } from "react-router-dom";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Badge,
} from "@mui/material";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import BlockIcon from "@mui/icons-material/Block";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";

interface ProfileSidebarProps {
  isOwnProfile: boolean;
  followers: any[];
  following: any[];
  requests: any[];
  blocked: any[];
  posts: any[];
  onOpenFollowers: () => void;
  onOpenFollowing: () => void;
  onOpenRequests: () => void;
  onOpenBlocked: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function ProfileSidebar({
  isOwnProfile,
  followers,
  following,
  requests,
  blocked,
  posts,
  onOpenFollowers,
  onOpenFollowing,
  onOpenRequests,
  onOpenBlocked,
  activeTab,
  setActiveTab,
}: ProfileSidebarProps) {
  return (
    <Paper elevation={0} className="border border-gray-200 rounded-lg">
      <List component="nav">
        <ListItem
          button
          onClick={() => setActiveTab("posts")}
          selected={activeTab === "posts"}
        >
          <ListItemIcon>
            <PhotoLibraryIcon />
          </ListItemIcon>
          <ListItemText primary="Posts" secondary={`${posts?.length} posts`} />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            setActiveTab("followers");
            onOpenFollowers();
          }}
          selected={activeTab === "followers"}
        >
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText
            primary="Followers"
            secondary={`${followers?.length} followers`}
          />
        </ListItem>

        <ListItem
          button
          onClick={() => {
            setActiveTab("following");
            onOpenFollowing();
          }}
          selected={activeTab === "following"}
        >
          <ListItemIcon>
            <PeopleAltIcon />
          </ListItemIcon>
          <ListItemText
            primary="Following"
            secondary={`${following?.length} following`}
          />
        </ListItem>

        {isOwnProfile && (
          <>
            <ListItem
              button
              onClick={() => {
                setActiveTab("requests");
                onOpenRequests();
              }}
              selected={activeTab === "requests"}
            >
              <ListItemIcon>
                <Badge badgeContent={requests?.length} color="primary">
                  <PersonAddIcon />
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary="Follow Requests"
                secondary={`${requests?.length} pending`}
              />
            </ListItem>

            <ListItem
              button
              onClick={() => {
                setActiveTab("blocked");
                onOpenBlocked();
              }}
              selected={activeTab === "blocked"}
            >
              <ListItemIcon>
                <BlockIcon />
              </ListItemIcon>
              <ListItemText
                primary="Blocked Users"
                secondary={`${blocked?.length} users`}
              />
            </ListItem>
          </>
        )}
      </List>
    </Paper>
  );
}

import { useNavigate } from "react-router";
import { useAuth } from "../../context/AuthContext";
import {
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import PeopleIcon from "@mui/icons-material/People";

export default function LeftSidebar() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/signin");
  };

  const menuItems = [
    { text: "Home", icon: <HomeIcon />, onClick: () => navigate("/") },
    {
      text: "Profile",
      icon: <AccountCircleIcon />,
      onClick: () => navigate(`/profile/${user?.id}`),
    },
    {
      text: "Network",
      icon: <PeopleIcon />,
      onClick: () => navigate(`/profile/${user?.id}`),
    },
    { text: "Logout", icon: <LogoutIcon />, onClick: handleLogout },
  ];

  return (
    <Paper className="p-4 sticky top-20 border-none shadow-none bg-white">
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            onClick={item.onClick}
            className="hover:bg-[#FAFAFA] rounded-lg mb-2 cursor-pointer transition-colors"
            sx={{
              "& .MuiListItemIcon-root": {
                color: "#262626",
                minWidth: "40px",
              },
              "& .MuiListItemText-primary": {
                color: "#262626",
                fontWeight: 500,
              },
              "&:hover .MuiListItemIcon-root": {
                color: "#0095F6",
              },
              "&:hover .MuiListItemText-primary": {
                color: "#0095F6",
              },
            }}
          >
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}

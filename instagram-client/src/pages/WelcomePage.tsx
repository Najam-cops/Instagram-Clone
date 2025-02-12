import { Box, Button, Container, Typography } from "@mui/material";
import { useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

const WelcomePage = () => {
  const navigate = useNavigate();
  const { isLoading, isAuthenticated } = useAuth();

  if (isLoading) {
    return null;
  }

  if (isAuthenticated) {
    navigate("/timeline");
  }

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: 3,
        }}
      >
        <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
          Instagram
        </Typography>

        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            fullWidth
            onClick={() => navigate("/signin")}
            sx={{ borderRadius: 2 }}
          >
            Log In
          </Button>

          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate("/signup")}
            sx={{ borderRadius: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default WelcomePage;

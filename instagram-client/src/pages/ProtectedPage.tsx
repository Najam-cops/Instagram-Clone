import React from "react";
import { Container, Typography, Box } from "@mui/material";

const ProtectedPage: React.FC = () => {
  return (
    <Container
      maxWidth="sm"
      style={{ textAlign: "center", marginTop: "100px" }}
    >
      <Box boxShadow={3} p={4} borderRadius={8} bgcolor="background.paper">
        <Typography variant="h4" gutterBottom>
          Protected Page
        </Typography>
        <Typography variant="body1" gutterBottom>
          You are viewing a protected page, means you are loggeed in .
        </Typography>
      </Box>
    </Container>
  );
};

export default ProtectedPage;

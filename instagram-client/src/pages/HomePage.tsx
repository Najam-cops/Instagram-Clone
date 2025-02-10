import React from "react";
import { Container, Typography } from "@mui/material";

const HomePage: React.FC = () => {
  return (
    <div className="bg-gray-100 h-screen">
      <Container>
        <Typography variant="h4" className="text-center mb-4">
          Welcome to Instagram Clone
        </Typography>
        <Typography variant="body1" className="text-center mb-4">
          This is a placeholder page.
        </Typography>
      </Container>
    </div>
  );
};

export default HomePage;

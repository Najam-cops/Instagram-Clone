import { useState } from "react";
import { useNavigate } from "react-router";
import { Box, Typography, Alert } from "@mui/material";
import SignUpForm from "../forms/SignUpForm";
import { useAuth } from "../context/AuthContext";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [error, setError] = useState<string | null>(null);

  const handleSignup = async (data: {
    email: string;
    password: string;
    username: string;
    name: string;
    confirmPassword?: string;
  }) => {
    try {
      setError(null);
      // Remove confirmPassword before sending to API
      const { confirmPassword: _, ...signupData } = data;
      await signup(signupData);
      navigate("/");
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      setError(
        error.response?.data?.message ||
          "Failed to create account. Please try again."
      );
    }
  };

  return (
    <Box className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
      <Box className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <Typography variant="h4" className="text-center mb-6">
          Create Account
        </Typography>

        {error && (
          <Alert severity="error" className="mb-4">
            {error}
          </Alert>
        )}

        <SignUpForm onSubmit={handleSignup} />

        <Box className="mt-4 text-center">
          <Typography variant="body2" color="textSecondary">
            Already have an account?{" "}
            <span
              onClick={() => navigate("/signin")}
              className="text-blue-500 cursor-pointer hover:underline"
            >
              Sign In
            </span>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupPage;

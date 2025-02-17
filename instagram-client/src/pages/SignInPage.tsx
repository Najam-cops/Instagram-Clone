import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInForm from "../forms/SignInForm";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { Box, Typography } from "@mui/material";
import { useNavigate } from "react-router";

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const { signin } = useAuth();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
      setLoading(true);
      await signin(data.username, data.password);
    } catch (err: any) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignInForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
        loading={loading}
      />
      <Box className="mt-4 text-center">
        <Typography variant="body2" color="textSecondary">
          Dost Not have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            className="text-blue-500 cursor-pointer hover:underline"
          >
            Sign Up
          </span>
        </Typography>
      </Box>
    </div>
  );
};

export default SignInPage;

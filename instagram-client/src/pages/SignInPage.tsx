import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInForm from "../forms/SignInForm";
import { useAuth } from "../context/AuthContext";

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const [error, setError] = useState<string | null>(null);
  const { signin } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  });

  const onSubmit = (data: SignInFormData) => {
    setError(null);
    try {
      signin(data.username, data.password);
    } catch (err) {
      console.log(err);
      setError("Sign in failed");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <SignInForm
        onSubmit={handleSubmit(onSubmit)}
        register={register}
        errors={errors}
      />
      {error && <p className="text-red-500 mt-4">{error}</p>}
    </div>
  );
};

export default SignInPage;

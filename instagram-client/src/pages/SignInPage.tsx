import { set, z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import SignInForm from "../forms/SignInForm";
import { useAuth } from "../context/AuthContext";
import { useAlert } from "../context/AlertContext";
import { useState } from "react";

const signInSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

type SignInFormData = z.infer<typeof signInSchema>;

const SignInPage = () => {
  const { signin } = useAuth();
  const { showAlert } = useAlert();
  const [loading, setLoading] = useState(false);
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
      showAlert("Successfully signed in!", "success");
    } catch (err: any) {
      console.log(err);
      showAlert(err.message || "Sign in failed", "error");
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
    </div>
  );
};

export default SignInPage;

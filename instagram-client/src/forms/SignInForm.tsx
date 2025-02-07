import { TextField, Button } from "@mui/material";

interface SignInFormProps {
  onSubmit: (e: React.FormEvent) => void;
  register: any;
  errors: any;
}

const SignInForm = ({ onSubmit, register, errors }: SignInFormProps) => {
  return (
    <form
      className="flex flex-col items-center space-y-4 w-2xl gap-1"
      onSubmit={onSubmit}
    >
      <TextField
        {...register("username")}
        name="username"
        label="Username"
        variant="outlined"
        className="w-full"
        error={!!errors.username}
        helperText={errors.username?.message}
      />
      <TextField
        {...register("password")}
        name="password"
        label="Password"
        type="password"
        variant="outlined"
        className="w-full"
        error={!!errors.password}
        helperText={errors.password?.message}
      />
      <Button
        variant="contained"
        color="primary"
        type="submit"
        className="w-full"
      >
        Sign In
      </Button>
    </form>
  );
};

export default SignInForm;

import React, { useState } from "react";
import { TextField, Button } from "@mui/material";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ email, username, name, password });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <TextField
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
      </div>
      <div>
        <TextField
          label="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
        />
      </div>
      <Button
        type="submit"
        variant="contained"
        color="primary"
        className="w-full"
      >
        Sign Up
      </Button>
    </form>
  );
};

export default SignUpForm;

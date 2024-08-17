"use client";

import { Alert, Button, Stack, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { useQuery } from "@/hooks/useQuery";
import { PublicUser } from "@/types";
import { Tokens, Routes } from "@/constants";
import Link from "next/link";
import PasswordField from "@/components/PasswordArea";

export default function Login({ searchParams }: any) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [login, { loading, error }] = useQuery<{
    token: string;
    user: PublicUser;
  }>({
    endpoint: "/api/auth/login",
    method: "POST",
    body: {
      email,
      password,
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem(Tokens.accessTokenId, data.token);
        if (searchParams?.next) {
          window.location.assign(searchParams.next);
        } else {
          window.location.assign(Routes.dashboard);
        }
      }
    },
  });

  const handleLogin = () => {
    // validate email and password
    if (!email || !password) return;
    login();
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin();
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      <Stack spacing={2}>
        <TextField
          label="Email"
          type="email"
          autoComplete="off"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          fullWidth
          required
        />
        <PasswordField
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="off"
          fullWidth
          required
        />
        <Typography variant="body1" align="center" my={2}>
          Having trouble logging in?{" "}
          <Link
            href={Routes.forgotPassword}
            style={{
              textDecoration: "underline",
            }}
          >
            Reset your password
          </Link>
        </Typography>
        <Button
          variant="contained"
          fullWidth
          size="large"
          sx={{
            textTransform: "none",
            fontSize: "1rem",
          }}
          disabled={loading}
          type="submit"
        >
          {loading ? "Loading..." : "Login"}
        </Button>
      </Stack>
    </form>
  );
}

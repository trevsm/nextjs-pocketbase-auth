"use client";
import { useState } from "react";
import { Tokens, Routes } from "@/constants";
import { useQuery } from "@/hooks/useQuery";
import { Alert, Button, Stack, TextField } from "@mui/material";
import PasswordField from "@/components/PasswordArea";
import PasswordStrengthGauge from "@/components/PasswordStrengthGuage";

export default function ForgotPassword({ searchParams }: any) {
  const [email, setEmail] = useState(searchParams?.email || "");
  const [new_password, setNewPassword] = useState("");

  const reset_token = searchParams?.reset_token;

  const [, { data: tokenData, loading: tokenLoading, error: tokenError }] =
    useQuery<{
      message: string;
    }>({
      endpoint: "/api/auth/reset/check_token",
      method: "POST",
      body: {
        reset_token,
      },
      fetchOnMount: !!reset_token,
    });

  const [
    sendResetLink,
    { data: forgotData, loading: forgotLoading, error: forgotError },
  ] = useQuery<{
    message: string;
  }>({
    endpoint: "/api/auth/forgot",
    method: "POST",
    body: {
      email,
    },
    onSuccess: () => {
      setEmail("");
    },
  });

  const [
    resetPassword,
    { data: resetData, loading: resetLoading, error: resetError },
  ] = useQuery<{
    message: string;
  }>({
    endpoint: "/api/auth/reset",
    method: "POST",
    body: {
      new_password,
      reset_token,
    },
    onSuccess: (data) => {
      console.log(data);
    },
  });

  const [login, { loading: loginLoading, error: loginError }] = useQuery<{
    token: string;
  }>({
    endpoint: "/api/auth/login",
    method: "POST",
    body: {
      email,
      password: new_password,
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

  const error = forgotError || resetError;
  const loading = forgotLoading || resetLoading;

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reset_token) {
      resetPassword();
    } else {
      sendResetLink();
    }
  };

  if (reset_token && ((!tokenData && !tokenError) || tokenLoading))
    return (
      <Stack spacing={2}>
        <Alert severity="info" sx={{ mb: 2 }}>
          Checking reset token...
        </Alert>
      </Stack>
    );

  if (tokenError)
    return (
      <Stack spacing={2}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {tokenError.message}
        </Alert>
        <Button
          variant="contained"
          size="large"
          sx={{ textTransform: "none" }}
          onClick={() => {
            window.location.assign(Routes.home);
          }}
        >
          Return to Home
        </Button>
      </Stack>
    );

  if (resetData)
    return (
      <Stack spacing={2}>
        <Alert severity="success" sx={{ mb: 2 }}>
          {resetData.message}
        </Alert>
        {loginError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {loginError.message}
          </Alert>
        )}
        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            size="large"
            sx={{ textTransform: "none" }}
            onClick={() => {
              login();
            }}
            disabled={loginLoading}
          >
            Login
          </Button>
          <Button
            variant="outlined"
            size="large"
            sx={{ textTransform: "none" }}
            onClick={() => {
              window.location.assign(Routes.home);
            }}
          >
            Return to Home
          </Button>
        </Stack>
      </Stack>
    );

  return (
    <form onSubmit={handleFormSubmit}>
      <Stack spacing={2}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error.message}
          </Alert>
        )}
        {reset_token ? (
          <>
            <PasswordField
              label="New Password"
              value={new_password}
              autoComplete="off"
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
              required
            />
            <PasswordStrengthGauge password={new_password} />
          </>
        ) : !forgotData ? (
          <TextField
            label="Email"
            disabled={loading}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
          />
        ) : null}
        {forgotData ? (
          <Alert severity="success" sx={{ mb: 2 }}>
            {forgotData.message}
          </Alert>
        ) : (
          <Button
            variant="contained"
            fullWidth
            size="large"
            type="submit"
            disabled={loading}
            sx={{
              textTransform: "none",
            }}
          >
            {loading
              ? "Loading..."
              : reset_token
              ? "Reset Password"
              : "Send Reset Link"}
          </Button>
        )}
      </Stack>
    </form>
  );
}

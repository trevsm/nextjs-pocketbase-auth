"use client";

import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Tokens, Routes } from "@/constants";
import { useQuery } from "@/hooks/useQuery";
import { PublicUser } from "@/types";
import PasswordField from "@/components/PasswordArea";
import PasswordStrengthGauge from "@/components/PasswordStrengthGuage";

export default function Login({ searchParams }: any) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [isVerifying, setIsVerifying] = useState(false);

  const [sendVerification, { loading: verifyLoading, error: verifyError }] =
    useQuery({
      endpoint: "/api/auth/signup/verify_email",
      method: "POST",
      body: {
        email,
      },
      onSuccess: () => {
        setIsVerifying(true);
      },
    });

  const [finishSignup, { error: signupError, loading: signupLoading }] =
    useQuery<{
      token: string;
      user: PublicUser;
    }>({
      endpoint: "/api/auth/signup/complete",
      method: "POST",
      body: {
        email,
        code,
        name,
        password,
      },
      onSuccess: (data) => {
        if (data.token) {
          localStorage.setItem(Tokens.accessTokenId, data.token);

          setTimeout(() => {
            if (searchParams?.next) {
              window.location.assign(searchParams.next);
            } else {
              window.location.assign(Routes.dashboard);
            }
          }, 1000);
        }
      },
    });

  const handleCreateAccount = () => {
    // validate email and password
    if (!email || !password || !name) return;

    if (isVerifying) {
      finishSignup();
    } else {
      sendVerification();
    }
  };

  const error = verifyError || signupError;
  const loading = verifyLoading || signupLoading;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleCreateAccount();
      }}
    >
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      )}
      <Stack spacing={2}>
        {isVerifying ? (
          <>
            <Typography variant="body1">
              Verification code sent to {email}
            </Typography>
            <TextField
              label="Verification Code"
              type="text"
              autoComplete="off"
              disabled={loading}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              fullWidth
              required
            />
          </>
        ) : (
          <>
            <TextField
              label="Full Name"
              type="text"
              autoComplete="off"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading}
              fullWidth
              required
            />
            <TextField
              label="Email"
              type="email"
              autoComplete="off"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              fullWidth
              required
            />
            <Box>
              <PasswordField
                label="Password"
                value={password}
                autoComplete="off"
                onChange={(e: any) => setPassword(e.target.value)}
                fullWidth
                required
              />
              <PasswordStrengthGauge password={password} />
            </Box>
          </>
        )}
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
          {verifyLoading
            ? "Processing..."
            : signupLoading
            ? "Creating Account..."
            : isVerifying
            ? "Submit"
            : "Create Account"}
        </Button>
      </Stack>
    </form>
  );
}

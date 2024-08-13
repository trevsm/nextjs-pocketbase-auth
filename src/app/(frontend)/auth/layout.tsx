"use client";

import { Alert, Box, Stack, Typography } from "@mui/material";
import { usePathname } from "next/navigation";
import { Tokens, Routes } from "@/constants";
import { CSSProperties, useEffect, useState } from "react";
import { CenteredLayout } from "@/components/CenteredLayout";
import Link from "next/link";
import { useQuery } from "@/hooks/useQuery";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const [, { data }] = useQuery<{
    user: {
      email: string;
      id: string;
      name: string;
    };
  }>({
    endpoint: "/api/me",
    method: "GET",
    fetchOnMount: true,
  });

  const { user } = data || {};

  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [searchParams, setSearchParams] = useState<{ [key: string]: any }>({});
  const nextPath = searchParams?.next
    ? "?next=" + encodeURIComponent(searchParams.next)
    : "";

  useEffect(() => {
    const search = new URLSearchParams(window.location.search);
    const params: { [key: string]: any } = {};
    for (const [key, value] of search) {
      params[key] = value;
    }

    setSearchParams(params);
    setAccessToken(localStorage?.getItem(Tokens.accessTokenId));
  }, []);

  const loading = false;

  const text = () => {
    switch (pathname) {
      case Routes.login:
        return {
          title: "Login",
          body: "This is the login page. You can login here.",
          extra: "Login to a different account?",
        };
      case Routes.register:
        return {
          title: "Register",
          body: "This is the register page. You can register here.",
          extra: "Register a new account?",
        };
      case Routes.forgotPassword:
        return {
          title: "Reset Password",
          body: "This is the forgot password page. You can reset your password here.",
          extra: null,
        };
      default:
        return {
          title: "...",
          body: "...",
        };
    }
  };

  const wording = text();

  const disabledStyles = {
    opacity: 0.4,
    pointerEvents: "none",
  } as CSSProperties;

  return (
    <CenteredLayout>
      <Typography variant="h4" align="center" mb={2}>
        {wording.title}
      </Typography>
      <Typography variant="body1" align="center" mb={2}>
        {wording.body}
      </Typography>
      {pathname == Routes.forgotPassword ? null : accessToken && loading ? (
        <Typography variant="body1" align="center" mb={3}>
          Loading...
        </Typography>
      ) : user ? (
        <Box mb={2}>
          <Alert severity="info" sx={{ mb: 2 }}>
            You are currently logged in as:
            <br />
            <b>
              {user.name} ({user.email}).
            </b>
            <br />
            <Link
              href={Routes.dashboard}
              style={{
                textDecoration: "underline",
              }}
            >
              Dashboard
            </Link>{" "}
          </Alert>
        </Box>
      ) : null}
      {
        // if pathname is neither, then dont show any
        pathname === Routes.forgotPassword ? null : (
          <Stack
            direction="row"
            spacing={1}
            mb={2}
            sx={{
              a: {
                backgroundColor: "#e0e0e0",
                padding: "8px 14px",
                borderRadius: 3,
              },
            }}
          >
            <Link
              href={Routes.login + nextPath}
              style={{
                ...(pathname === Routes.login ? disabledStyles : {}),
              }}
            >
              Login
            </Link>
            <Link
              href={Routes.register + nextPath}
              style={{
                ...(pathname === Routes.register ? disabledStyles : {}),
              }}
            >
              Register
            </Link>
          </Stack>
        )
      }
      <Box
        sx={{
          "& .MuiInputBase-root, button": {
            borderRadius: 3,
          },
        }}
      >
        {children}
      </Box>
    </CenteredLayout>
  );
}

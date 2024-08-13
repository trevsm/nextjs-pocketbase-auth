"use client";

import { Tokens, Routes } from "@/constants";
import { AuthResponse } from "@/types";
import { useQuery } from "@/hooks/useQuery";
import { useUser } from "@/stores/useUser";
import { CircularProgress, Grid, Typography } from "@mui/material";
import { redirect } from "next/navigation";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

interface AuthRequiredProps extends React.PropsWithChildren {
  typeMatch: string;
  children?: React.ReactNode;
}

function AuthRequired({ children, typeMatch }: AuthRequiredProps) {
  const { user, setUser } = useUser();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  const [, { error }] = useQuery({
    fetchOnMount: true,
    endpoint: "/api/me",
    onSuccess: (data: AuthResponse) => {
      setUser(data.user);
    },
  });

  const pathname = usePathname();
  const redirectPath = Routes.login + "?next=" + encodeURIComponent(pathname);

  useEffect(() => {
    if (!localStorage?.getItem(Tokens.accessTokenId)) {
      setShouldRedirect(true);
    }
  }, []);

  if (shouldRedirect) {
    return redirect(redirectPath);
  }

  if (error) return redirect(redirectPath);

  if (user) return <>{children}</>;

  return (
    <Grid
      container
      justifyContent="center"
      alignItems="center"
      sx={{
        height: "100%",
      }}
    >
      <Grid
        item
        sx={{
          textAlign: "center",
        }}
      >
        <CircularProgress size={45} />
        <Typography variant="body2" mt={1}>
          Loading...
        </Typography>
      </Grid>
    </Grid>
  );
}

export default AuthRequired;

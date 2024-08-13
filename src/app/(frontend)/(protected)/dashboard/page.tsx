"use client";

import { Tokens } from "@/constants";
import { useQuery } from "@/hooks/useQuery";
import { useUser } from "@/stores/useUser";
import { Button, Container, Paper, Stack, Typography } from "@mui/material";

export default function Dashboard() {
  const { user } = useUser();

  const [logout] = useQuery({
    endpoint: "/api/auth/logout",
    method: "POST",
    onSuccess: () => {
      localStorage.removeItem(Tokens.accessTokenId);
      window.location.assign("/");
    },
  });

  const todaysDate = new Date().toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <Container maxWidth="md" sx={{ paddingTop: 5 }}>
      <Stack spacing={2}>
        <Button
          variant="contained"
          sx={{
            maxWidth: "fit-content",
          }}
          onClick={logout}
        >
          Logout
        </Button>
        <Paper sx={{ padding: 2 }}>
          <Typography variant="h5" component="h1">
            Hey, {user?.name}!
          </Typography>
          <Typography variant="body1" component="p">
            {todaysDate}
          </Typography>
        </Paper>
      </Stack>
    </Container>
  );
}

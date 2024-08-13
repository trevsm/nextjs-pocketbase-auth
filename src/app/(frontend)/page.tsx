"use client";

import { Container, Typography, Button, Box, Stack } from "@mui/material";

export default function Landing() {
  return (
    <Container maxWidth="md" sx={{ paddingTop: 5 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Next.js PocketBase Auth Example
      </Typography>
      <Typography variant="h6" component="p" gutterBottom>
        A template for setting up authentication in a Next.js app using
        PocketBase.
      </Typography>

      <Typography variant="h5" component="h2" gutterBottom>
        Features:
      </Typography>
      <ul>
        <li>
          <Typography variant="body1">Integrates with PocketBase</Typography>
        </li>
        <li>
          <Typography variant="body1">Basic sign-up and login pages</Typography>
        </li>
        <li>
          <Typography variant="body1">Uses Material-UI for styling</Typography>
        </li>
        <li>
          <Typography variant="body1">TypeScript support</Typography>
        </li>
      </ul>

      <Typography variant="h5" component="h2" gutterBottom>
        Why Use This?
      </Typography>
      <Typography variant="body1" gutterBottom>
        This template helps you quickly set up user authentication in your
        Next.js app. It comes with basic pages and styling, so you can focus on
        building your app.
      </Typography>

      <Stack spacing={1} direction="row" mt={4}>
        {/* login and signup */}
        <Button variant="contained" color="primary" href="/auth/login">
          Login
        </Button>
        <Button variant="contained" color="primary" href="/auth/signup">
          Sign Up
        </Button>
      </Stack>
    </Container>
  );
}

"use client"

import { Grid, Paper, ThemeProvider, createTheme } from "@mui/material"

const theme = createTheme({
  typography: {
    fontFamily: "inherit",
    fontSize: 16,
  },
})

export function CenteredLayout({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <Grid
        container
        sx={{
          placeItems: "center",
          justifyContent: "center",
          height: "100%",
          padding: 2,
        }}
      >
        <Grid
          item
          sx={{
            maxWidth: 500,
            width: "100%",
          }}
        >
          <Paper
            elevation={0}
            sx={{
              padding: 5,
              borderRadius: 6,
              border: "1px solid #e7eae9",
            }}
          >
            {children}
          </Paper>
        </Grid>
      </Grid>
    </ThemeProvider>
  )
}

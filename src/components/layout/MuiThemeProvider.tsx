"use client";

import { createTheme, ThemeProvider, CssBaseline } from "@mui/material";
import { ReactNode } from "react";

const muiTheme = createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: "#10b981", // Emerald 500
    },
    secondary: {
      main: "#a855f7", // Purple 500
    },
    background: {
      default: "#000000",
      paper: "rgba(16, 185, 129, 0.05)",
    },
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
  },
  shape: {
    borderRadius: 16,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 700,
          borderRadius: 12,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
          border: "1px solid rgba(16, 185, 129, 0.2)",
          backdropFilter: "blur(16px)",
        },
      },
    },
  },
});

export default function MuiThemeProvider({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}

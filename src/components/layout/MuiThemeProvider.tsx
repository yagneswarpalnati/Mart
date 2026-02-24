"use client";

import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

const muiTheme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#2ECC71",
    },
    secondary: {
      main: "#27AE60",
    },
    background: {
      default: "#F7F8FA",
      paper: "#FFFFFF",
    },
    text: {
      primary: "#1E1E1E",
      secondary: "#7F8C8D",
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: '"Outfit", "Inter", sans-serif',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          backgroundColor: "#F7F8FA",
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

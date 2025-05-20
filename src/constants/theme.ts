"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#e10019",
    },
    secondary: {
      main: "#003063",
    },
    text: {
      primary: "#000000",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 0,
          textTransform: "none",
          boxShadow: "none",
        },
        contained: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
        containedPrimary: {
          backgroundColor: "#003063",
          color: "#fff",
          border: "2px solid transparent",
          "&:hover": {
            backgroundColor: "#fff",
            color: "#003063",
            border: "2px solid #003063",
          },
        },
        containedSecondary: {
          backgroundColor: "#E10019",
          color: "#fff",
          border: "2px solid transparent",
          "&:hover": {
            backgroundColor: "#fff",
            color: "#E10019",
            border: "2px solid #E10019",
          },
        },
        outlinedPrimary: {
          border: "2px solid #003063",
          color: "#003063",
          "&:hover": {
            border: "2px solid #003063",
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 0,
        },
      },
    },
    MuiFab: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "#fff",
          color: "#000",
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(227,227,227,0.5)",
          borderRadius: 0,
          boxShadow: "none",
          color: "#000",
        },
      },
    },
  },
});

export default theme;

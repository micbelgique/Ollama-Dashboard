import { createTheme } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    purple: Palette["primary"];
  }
  interface PaletteOptions {
    purple?: PaletteOptions["primary"];
  }

  interface PaletteColor {
    lighter?: string;
  }
  interface SimplePaletteColorOptions {
    lighter?: string;
  }
}

export const theme = createTheme({
  palette: {
    primary: {
      main: "#4AA9FF",
      light: "#60a5fa",
      dark: "#2563eb",
      lighter: "#eff6ff",
    },
    secondary: {
      main: "#FF4D6A",
      light: "#fb7185",
      dark: "#e11d48",
      lighter: "#fff1f2",
    },
    purple: {
      main: "#9333ea",
      light: "#a855f7",
      dark: "#7e22ce",
      lighter: "#f5f3ff",
    },
    success: {
      main: "#16a34a",
      light: "#22c55e",
      dark: "#15803d",
      lighter: "#f0fdf4",
    },
    error: {
      main: "#dc2626",
      light: "#ef4444",
      dark: "#b91c1c",
      lighter: "#fef2f2",
    },
    warning: {
      main: "#f59e0b",
      light: "#fbbf24",
      dark: "#d97706",
      lighter: "#fffbeb",
    },
    info: {
      main: "#0ea5e9",
      light: "#38bdf8",
      dark: "#0284c7",
      lighter: "#f0f9ff",
    },
    text: {
      primary: "#334155",
      secondary: "#64748b",
    },
    background: {
      default: "#f8fafc",
      paper: "#ffffff",
    },
    grey: {
      50: "#f8fafc",
      100: "#f1f5f9",
      200: "#e2e8f0",
      300: "#cbd5e1",
      400: "#94a3b8",
      500: "#64748b",
      600: "#475569",
      700: "#334155",
      800: "#1e293b",
      900: "#0f172a",
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    subtitle1: {
      fontWeight: 500,
    },
    subtitle2: {
      fontWeight: 500,
    },
    button: {
      fontWeight: 600,
      textTransform: "none",
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: "none",
          "&:hover": {
            boxShadow: "none",
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow:
            "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
});

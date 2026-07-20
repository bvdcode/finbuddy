"use client";

import { alpha, createTheme } from "@mui/material/styles";
import type { PaletteColor, PaletteColorOptions } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    navigation: PaletteColor;
    surface: {
      subtle: string;
      tint: string;
      raised: string;
    };
    chart: {
      mint: string;
      blue: string;
      amber: string;
      coral: string;
      violet: string;
      slate: string;
    };
  }

  interface PaletteOptions {
    navigation?: PaletteColorOptions;
    surface?: {
      subtle: string;
      tint: string;
      raised: string;
    };
    chart?: {
      mint: string;
      blue: string;
      amber: string;
      coral: string;
      violet: string;
      slate: string;
    };
  }
}

const colors = {
  canvas: "#F4F2EC",
  paper: "#FEFEFC",
  navigation: "#17211D",
  navigationLight: "#25332D",
  mint: "#91D6B4",
  mintDark: "#397A5D",
  mintTint: "#E7F4ED",
  text: "#17201C",
  textMuted: "#68716C",
  border: "#DFE2DC",
  blue: "#79A8D8",
  amber: "#D5A452",
  coral: "#D37D69",
  violet: "#9C8CC5",
  slate: "#7E9389",
} as const;

export const appTheme = createTheme({
  cssVariables: true,
  palette: {
    mode: "light",
    primary: {
      main: colors.mintDark,
      light: colors.mint,
      dark: colors.navigationLight,
      contrastText: colors.paper,
    },
    secondary: {
      main: colors.navigation,
      light: colors.navigationLight,
      contrastText: colors.paper,
    },
    background: {
      default: colors.canvas,
      paper: colors.paper,
    },
    text: {
      primary: colors.text,
      secondary: colors.textMuted,
    },
    divider: colors.border,
    success: {
      main: colors.mintDark,
      light: colors.mintTint,
    },
    warning: {
      main: colors.amber,
    },
    error: {
      main: colors.coral,
    },
    navigation: {
      main: colors.navigation,
      light: colors.navigationLight,
      contrastText: colors.paper,
    },
    surface: {
      subtle: colors.canvas,
      tint: colors.mintTint,
      raised: colors.paper,
    },
    chart: {
      mint: colors.mintDark,
      blue: colors.blue,
      amber: colors.amber,
      coral: colors.coral,
      violet: colors.violet,
      slate: colors.slate,
    },
  },
  shape: {
    borderRadius: 18,
  },
  typography: {
    fontFamily: 'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    h1: {
      fontSize: "3.5rem",
      fontWeight: 650,
      letterSpacing: "-0.05em",
      lineHeight: 1.02,
    },
    h2: {
      fontSize: "2.25rem",
      fontWeight: 650,
      letterSpacing: "-0.035em",
      lineHeight: 1.08,
    },
    h3: {
      fontSize: "1.125rem",
      fontWeight: 650,
      letterSpacing: "-0.015em",
    },
    button: {
      fontWeight: 650,
      letterSpacing: 0,
      textTransform: "none",
    },
    overline: {
      fontWeight: 700,
      letterSpacing: "0.11em",
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          minWidth: 320,
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          minHeight: 44,
          borderRadius: 12,
          paddingInline: 18,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          minHeight: 44,
          minWidth: 44,
        },
      },
    },
    MuiCard: {
      defaultProps: {
        elevation: 0,
      },
      styleOverrides: {
        root: ({ theme }) => ({
          border: "1px solid " + theme.palette.divider,
          boxShadow:
            "0 18px 45px " +
            alpha(theme.palette.secondary.main, 0.045),
        }),
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          minHeight: 32,
          fontWeight: 650,
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
        },
      },
    },
  },
});

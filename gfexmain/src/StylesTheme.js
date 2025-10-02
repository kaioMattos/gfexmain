import { createTheme } from '@mui/material/styles';
// Tema customizado para manter o padrão shadcn/ui
  const oThemeOldApp = {
    typography: {
      fontFamily: 'PetrobrasSans_Rg',
    }
  };
  const oThemeNewApp = {
    typography: {
      fontFamily: 'PetrobrasSans_Rg',
      h4: {
        fontWeight: 600,
        fontSize: "1.875rem",
      },
      h6: {
        fontWeight: 600,
        fontSize: "1.125rem",
      },
      body2: {
        fontSize: "0.875rem",
      },
    },
    palette: {
      mode: "light",
      primary: {
        main: "#0f172a", // slate-900 similar ao shadcn
        light: "#334155", // slate-700
        dark: "#020617", // slate-950
      },
      secondary: {
        main: "#3b82f6", // blue-500
        light: "#60a5fa", // blue-400
        dark: "#1d4ed8", // blue-700
      },
      background: {
        default: "#f8fafc", // slate-50
        paper: "#ffffff",
      },
      text: {
        primary: "#0f172a", // slate-900
        secondary: "#64748b", // slate-500
      },
      grey: {
        50: "#f8fafc",
        100: "#f1f5f9",
        200: "#e2e8f0",
        300: "#cbd5e1",
        400: "#94a3b8",
        500: "#64748b",
      },
      success: {
        main: "rgb(8, 113, 60)", // emerald-500
        light: "rgb(3, 164, 83)",
        dark: "rgb(6, 79, 42);",
      },
      warning: {
        main: "rgb(245, 158, 11)", // amber-500
        light: "rgb(253, 200, 47)",
        dark: "rgb(198, 127, 9)",
      },
      info: {
        main: "rgb(23, 75, 104)", // blue-500
        light: "rgb(64, 137, 178)",
        dark: "rgb(22, 90, 128)",
      },
      error: {
        main: "rgb(237, 29, 36)", // red-500
        light: "rgb(221, 62, 67)",
        dark: "rgb(208, 8, 15)",
      },
      greyInfo:{
        main: "rgb(111, 108, 108)", // red-500
        light: "rgb(176, 173, 173)",
        dark: "rgb(85, 81, 81)",
      }
    },
    
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: "0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)",
            border: "1px solid #e2e8f0",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: "none",
            fontWeight: 500,
          },
          outlined: {
            borderColor: "#e2e8f0",
            color: "#64748b",
            "&:hover": {
              borderColor: "#cbd5e1",
              backgroundColor: "#f8fafc",
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          outlined: {
            borderColor: "#e2e8f0",
            color: "#64748b",
          },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: {
            backgroundColor: "#f8fafc",
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontWeight: 600,
            color: "#374151",
          },
        },
      },
    },
  }
 const theme = createTheme(process.env.REACT_APP_APP_ACTIVE === 'OLD' ? oThemeOldApp:oThemeNewApp);

export default theme
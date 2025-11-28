import { createTheme } from "@mui/material/styles";

// Basic MUI theme (customizable later)
const theme = createTheme({
  palette: {
    mode: "light",
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#9c27b0",
    },
  },
  typography: {
    fontFamily: "var(--font-geist-sans), sans-serif",
  },
});

export default theme;

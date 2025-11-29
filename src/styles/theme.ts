import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: { main: "#111111" }, // negro fuerte
    secondary: { main: "#c7e76a" }, // verde lima
    text: {
      primary: "#111111",
      secondary: "#5a5a5a",
    },
    background: {
      default: "#ffffff",
      paper: "#ffffff",
    }
  },

  typography: {
    fontFamily: "var(--font-inter-tight)",

    h4: {
      fontFamily: "var(--font-bebas)",
      fontSize: "2.4rem",
      letterSpacing: "1px",
    },

    h6: {
      fontFamily: "var(--font-inter-tight)",
      fontWeight: 600,
    }
  },

  components: {
    // Inputs
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          background: "#fff",
          borderRadius: 10,
          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#dcdcdc",
          },
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#c7e76a",
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: "#111111",
          },
        },
      },
    },

    // Buttons
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontFamily: "var(--font-bebas)",
          fontSize: "1.1rem",
          letterSpacing: 1,
        },
        containedPrimary: {
          backgroundColor: "#111111",
          color: "#fff",
          "&:hover": { backgroundColor: "#333" }
        },
        outlined: {
          borderColor: "#c7e76a",
          color: "#111111",
          "&:hover": {
            borderColor: "#111111",
            color: "#111111",
          },
        },
      },
    },
  },
});

export default theme;

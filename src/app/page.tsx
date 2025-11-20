"use client";

import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import QRCodeGenerator from "@/components/QRCodeGenerator";
import theme from "./theme";
import { Box } from "@mui/material";

export default function Home() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <QRCodeGenerator />
      </Box>
    </ThemeProvider>
  );
}

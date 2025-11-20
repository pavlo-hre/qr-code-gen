"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Slider,
  Typography,
  Paper,
  Stack,
  Chip,
  Divider,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import { QRCodeSVG } from "qrcode.react";

type ImageFormat = "png" | "jpeg" | "svg";

interface ColorScheme {
  name: string;
  fgColor: string;
  bgColor: string;
  displayBg: string;
}

const COLOR_SCHEMES: ColorScheme[] = [
  {
    name: "Classic",
    fgColor: "#000000",
    bgColor: "#FFFFFF",
    displayBg: "#FFFFFF",
  },
  {
    name: "Ocean",
    fgColor: "#0D47A1",
    bgColor: "#E3F2FD",
    displayBg: "#E3F2FD",
  },
  {
    name: "Forest",
    fgColor: "#1B5E20",
    bgColor: "#E8F5E9",
    displayBg: "#E8F5E9",
  },
  {
    name: "Sunset",
    fgColor: "#E65100",
    bgColor: "#FFF3E0",
    displayBg: "#FFF3E0",
  },
  {
    name: "Royal",
    fgColor: "#4A148C",
    bgColor: "#F3E5F5",
    displayBg: "#F3E5F5",
  },
  {
    name: "Berry",
    fgColor: "#880E4F",
    bgColor: "#FCE4EC",
    displayBg: "#FCE4EC",
  },
  {
    name: "Night",
    fgColor: "#FFFFFF",
    bgColor: "#212121",
    displayBg: "#212121",
  },
  {
    name: "Mint",
    fgColor: "#004D40",
    bgColor: "#E0F2F1",
    displayBg: "#E0F2F1",
  },
  {
    name: "Coral",
    fgColor: "#BF360C",
    bgColor: "#FBE9E7",
    displayBg: "#FBE9E7",
  },
  {
    name: "Lavender",
    fgColor: "#311B92",
    bgColor: "#EDE7F6",
    displayBg: "#EDE7F6",
  },
];

const QRCodeGenerator: React.FC = () => {
  const [mounted, setMounted] = useState(false);
  const [text, setText] = useState<string>("");
  const [qrSize, setQrSize] = useState<number>(256);
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>(
    COLOR_SCHEMES[0]
  );
  const qrRef = useRef<HTMLDivElement>(null);

  // This is intentional to prevent hydration mismatch with Material UI
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
  };

  const handleSizeChange = (_event: unknown, newValue: number | number[]) => {
    if (typeof newValue === "number") {
      setQrSize(newValue);
    }
  };

  const downloadQRCode = (format: ImageFormat) => {
    if (!text) {
      alert("Please enter some text to generate a QR code");
      return;
    }

    const svg = qrRef.current?.querySelector("svg");
    if (!svg) return;

    if (format === "svg") {
      // Download as SVG
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement("a");
      downloadLink.href = svgUrl;
      downloadLink.download = `qrcode.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } else {
      // Download as PNG or JPEG
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        canvas.width = qrSize;
        canvas.height = qrSize;

        // Fill with the selected background color
        ctx!.fillStyle = selectedScheme.bgColor;
        ctx?.fillRect(0, 0, qrSize, qrSize);

        ctx?.drawImage(img, 0, 0);

        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const downloadLink = document.createElement("a");
            downloadLink.href = url;
            downloadLink.download = `qrcode.${format}`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            URL.revokeObjectURL(url);
          }
        }, `image/${format}`);
      };

      img.src =
        "data:image/svg+xml;base64," +
        btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper
        elevation={0}
        sx={{ p: 4, borderRadius: 3, bgcolor: "background.default" }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ mb: 4, fontWeight: 700, color: "primary.main" }}
        >
          QR Code Generator
        </Typography>

        <Stack spacing={4}>
          {/* Text Input */}
          <TextField
            fullWidth
            label="Enter text or URL"
            variant="outlined"
            value={text}
            onChange={handleTextChange}
            placeholder="Type something to generate QR code..."
            multiline
            rows={3}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: 2,
              },
            }}
          />

          {/* Size Adjustment */}
          <Box>
            <Typography gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              QR Code Size: {qrSize}px
            </Typography>
            <Slider
              value={qrSize}
              onChange={handleSizeChange}
              min={128}
              max={512}
              step={32}
              marks
              valueLabelDisplay="auto"
              aria-label="QR Code Size"
              sx={{
                "& .MuiSlider-thumb": {
                  width: 20,
                  height: 20,
                },
              }}
            />
          </Box>

          {/* Color Scheme Selection */}
          <Box>
            <Typography gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Color Scheme
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2 }}>
              {COLOR_SCHEMES.map((scheme) => (
                <Chip
                  key={scheme.name}
                  label={scheme.name}
                  onClick={() => setSelectedScheme(scheme)}
                  sx={{
                    bgcolor:
                      selectedScheme.name === scheme.name
                        ? "primary.main"
                        : "background.paper",
                    color:
                      selectedScheme.name === scheme.name
                        ? "white"
                        : "text.primary",
                    border: `2px solid ${
                      selectedScheme.name === scheme.name
                        ? "transparent"
                        : scheme.fgColor
                    }`,
                    fontWeight: selectedScheme.name === scheme.name ? 600 : 400,
                    cursor: "pointer",
                    transition: "all 0.2s",
                    px: 2.5,
                    py: 1.5,
                    height: "auto",
                    fontSize: "0.9rem",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    "&::before": {
                      content: '""',
                      display: "inline-block",
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      bgcolor: scheme.bgColor,
                      border: `2px solid ${scheme.fgColor}`,
                      mr: 1,
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* QR Code Display */}
          {text && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                p: 4,
              }}
            >
              <Box
                ref={qrRef}
                sx={{
                  p: 2,
                  bgcolor: selectedScheme.displayBg,
                }}
              >
                <QRCodeSVG
                  value={text}
                  size={qrSize}
                  level="H"
                  includeMargin={true}
                  fgColor={selectedScheme.fgColor}
                  bgColor={selectedScheme.bgColor}
                />
              </Box>
            </Box>
          )}

          {/* Download Buttons */}
          {text && (
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                p: 3,
                border: "2px solid",
                borderColor: "primary.main",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <DownloadIcon sx={{ mr: 1, color: "primary.main" }} />
                <Typography
                  variant="h6"
                  sx={{ fontWeight: 700, color: "primary.main" }}
                >
                  Download Your QR Code
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{ mb: 3, color: "text.secondary" }}
              >
                Choose your preferred format below:
              </Typography>
              <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={() => downloadQRCode("png")}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  PNG
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={() => downloadQRCode("jpeg")}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  JPEG
                </Button>
                <Button
                  variant="contained"
                  startIcon={<ImageIcon />}
                  onClick={() => downloadQRCode("svg")}
                  size="large"
                  sx={{
                    borderRadius: 2,
                    textTransform: "none",
                    px: 4,
                    py: 1.5,
                    fontSize: "1rem",
                    fontWeight: 600,
                    boxShadow: 3,
                    "&:hover": {
                      boxShadow: 6,
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.2s",
                  }}
                >
                  SVG
                </Button>
              </Stack>
              <Typography
                variant="caption"
                sx={{ display: "block", mt: 2, color: "text.secondary" }}
              >
                💡 Tip: PNG for web, JPEG for smaller files, SVG for print
              </Typography>
            </Box>
          )}
        </Stack>
      </Paper>
    </Container>
  );
};

export default QRCodeGenerator;

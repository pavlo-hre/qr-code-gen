"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  Chip,
  FormControlLabel,
  Checkbox,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import DownloadIcon from "@mui/icons-material/Download";
import ImageIcon from "@mui/icons-material/Image";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import { QRCodeSVG } from "qrcode.react";

type ImageFormat = "png" | "jpeg" | "svg";

interface ColorScheme {
  name: string;
  fgColor: string;
  bgColor: string;
  displayBg: string;
}

interface CaptionStyle {
  id: string;
  name: string;
  borderRadius: number;
  bgStyle: "solid" | "outline" | "minimal" | "none";
  hasFrame: boolean;
  frameRadius: number;
  framePadding: number;
}

const CAPTION_STYLES: CaptionStyle[] = [
  {
    id: "none",
    name: "None",
    borderRadius: 0,
    bgStyle: "none",
    hasFrame: false,
    frameRadius: 0,
    framePadding: 0,
  },
  {
    id: "minimal",
    name: "Minimal",
    borderRadius: 0,
    bgStyle: "minimal",
    hasFrame: true,
    frameRadius: 24,
    framePadding: 24,
  },
  {
    id: "solid",
    name: "Solid",
    borderRadius: 16,
    bgStyle: "solid",
    hasFrame: true,
    frameRadius: 24,
    framePadding: 24,
  },
];

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
  const [selectedScheme, setSelectedScheme] = useState<ColorScheme>(
    COLOR_SCHEMES[0]
  );
  const [caption, setCaption] = useState<string>("");
  const [showCaption, setShowCaption] = useState<boolean>(false);
  const [captionStyle, setCaptionStyle] = useState<CaptionStyle>(
    CAPTION_STYLES[0]
  );
  const [showFrame, setShowFrame] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const qrRef = useRef<HTMLDivElement>(null);
  const qrSize = 512; // Fixed size

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
      // Download as PNG or JPEG with frame and caption
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();

      img.onload = () => {
        const frameThickness = captionStyle.hasFrame && showFrame ? 8 : 0;
        const framePadding = captionStyle.hasFrame && showFrame ? captionStyle.framePadding : 16;
        const captionHeight = showCaption && caption && captionStyle.id !== "none" ? 120 : 0; // Doubled for more space
        
        // Canvas size includes frame border, padding, QR code, and caption
        canvas.width = qrSize + (framePadding * 2) + (frameThickness * 2);
        canvas.height = qrSize + (framePadding * 2) + (frameThickness * 2) + captionHeight;

        // Fill background
        ctx!.fillStyle = (captionStyle.hasFrame && showFrame) ? selectedScheme.bgColor : selectedScheme.displayBg;
        ctx?.fillRect(0, 0, canvas.width, canvas.height);

        if (captionStyle.hasFrame && showFrame) {
          // Draw outer frame border
          ctx!.fillStyle = selectedScheme.fgColor;
          ctx!.beginPath();
          ctx!.roundRect(0, 0, canvas.width, canvas.height, captionStyle.frameRadius);
          ctx!.fill();

          // Draw inner white area
          ctx!.fillStyle = selectedScheme.bgColor;
          ctx!.beginPath();
          ctx!.roundRect(
            frameThickness,
            frameThickness,
            canvas.width - (frameThickness * 2),
            canvas.height - (frameThickness * 2),
            captionStyle.frameRadius - frameThickness
          );
          ctx!.fill();
        }

        // Draw QR code
        const qrX = frameThickness + framePadding;
        const qrY = frameThickness + framePadding;
        ctx?.drawImage(img, qrX, qrY, qrSize, qrSize);

        // Draw caption if exists - caption width matches QR code width
        if (showCaption && caption && captionStyle.id !== "none") {
          const captionY = qrY + qrSize + 4; // Small gap between QR and caption
          ctx!.font = "bold 22px Arial";
          const captionBoxWidth = qrSize; // Caption width matches QR code width
          const captionBoxHeight = 50;
          const captionX = qrX; // Align caption with QR code

          if (captionStyle.bgStyle === "solid") {
            // Solid background
            ctx!.fillStyle = selectedScheme.fgColor;
            ctx!.beginPath();
            ctx!.roundRect(
              captionX,
              captionY,
              captionBoxWidth,
              captionBoxHeight,
              captionStyle.borderRadius
            );
            ctx!.fill();

            // Text
            ctx!.fillStyle = selectedScheme.bgColor;
            ctx!.textAlign = "center";
            ctx!.textBaseline = "middle";
            ctx!.fillText(caption, captionX + captionBoxWidth / 2, captionY + captionBoxHeight / 2);
          } else if (captionStyle.bgStyle === "minimal") {
            // Just text, no background
            ctx!.fillStyle = selectedScheme.fgColor;
            ctx!.textAlign = "center";
            ctx!.textBaseline = "middle";
            ctx!.fillText(caption, captionX + captionBoxWidth / 2, captionY + 25);
          }
        }

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
    <Container maxWidth="md" sx={{ py: { xs: 4, md: 8 } }}>
      <Paper
        elevation={0}
        sx={{ 
          p: { xs: 2, sm: 3, md: 4 }, 
          borderRadius: 3, 
          bgcolor: "background.default" 
        }}
      >
        <Typography
          variant="h3"
          component="h1"
          gutterBottom
          align="center"
          sx={{ 
            mb: { xs: 2, md: 4 }, 
            fontWeight: 700, 
            color: "primary.main",
            fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" }
          }}
        >
          QR Code Generator
        </Typography>

        <Stack spacing={{ xs: 3, md: 4 }}>
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

          {/* Caption Input */}
          <Box>
            <Typography gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Add Caption (Optional)
            </Typography>
            <TextField
              fullWidth
              label="Caption text"
              variant="outlined"
              value={caption}
              onChange={(e) => {
                setCaption(e.target.value);
                setShowCaption(e.target.value.length > 0);
                // Auto-switch to Minimal style when caption is entered
                if (e.target.value.length > 0 && captionStyle.id === "none") {
                  setCaptionStyle(CAPTION_STYLES[1]); // Minimal style
                  setShowFrame(false); // No border
                }
              }}
              placeholder="e.g., Scan Me!, Visit our website..."
              multiline
              rows={2}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
          </Box>

          {/* Caption Style Selection */}
          {caption && (
            <Box>
              <Typography gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
                Caption Style
              </Typography>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 2, sm: 3 } }}>
                {CAPTION_STYLES.map((style) => (
                  <Box
                    key={style.id}
                    onClick={() => setCaptionStyle(style)}
                    sx={{
                      cursor: "pointer",
                      border: `3px solid ${
                        captionStyle.id === style.id ? "#1976d2" : "#d0d0d0"
                      }`,
                      borderRadius: 3,
                      p: { xs: 2.5, sm: 3 },
                      pt: { xs: 3.5, sm: 3 },
                      width: { xs: 110, sm: 130, md: 150 },
                      height: { xs: 120, sm: 130, md: 150 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      bgcolor: captionStyle.id === style.id ? "#e3f2fd" : "white",
                      boxShadow: captionStyle.id === style.id ? 3 : 1,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "scale(1.05)",
                        boxShadow: 4,
                        borderColor: captionStyle.id === style.id ? "#1976d2" : "#999",
                      },
                    }}
                  >
                    {style.id === "none" ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 0.5,
                        }}
                      >
                        {/* QR Code Pattern without frame */}
                        <Box
                          sx={{
                            width: { xs: 55, sm: 65 },
                            height: { xs: 55, sm: 65 },
                            border: "1px solid #e0e0e0",
                            borderRadius: 1,
                            overflow: "hidden",
                          }}
                          dangerouslySetInnerHTML={{
                            __html: `<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 29 29"><path fill="#FFFFFF" d="M0,0 h29v29H0z" shape-rendering="crispEdges"/><path fill="#000000" d="M4 4h7v1H4zM12 4h2v1H12zM15 4h1v1H15zM18,4 h7v1H18zM4 5h1v1H4zM10 5h1v1H10zM12 5h1v1H12zM15 5h2v1H15zM18 5h1v1H18zM24,5 h1v1H24zM4 6h1v1H4zM6 6h3v1H6zM10 6h1v1H10zM12 6h4v1H12zM18 6h1v1H18zM20 6h3v1H20zM24,6 h1v1H24zM4 7h1v1H4zM6 7h3v1H6zM10 7h1v1H10zM14 7h3v1H14zM18 7h1v1H18zM20 7h3v1H20zM24,7 h1v1H24zM4 8h1v1H4zM6 8h3v1H6zM10 8h1v1H10zM13 8h2v1H13zM18 8h1v1H18zM20 8h3v1H20zM24,8 h1v1H24zM4 9h1v1H4zM10 9h1v1H10zM12 9h5v1H12zM18 9h1v1H18zM24,9 h1v1H24zM4 10h7v1H4zM12 10h1v1H12zM14 10h1v1H14zM16 10h1v1H16zM18,10 h7v1H18zM12 11h2v1H12zM15 11h2v1H15zM6 12h3v1H6zM10 12h1v1H10zM12 12h3v1H12zM16 12h4v1H16zM22,12 h3v1H22zM7 13h2v1H7zM13 13h1v1H13zM15 13h3v1H15zM22 13h1v1H22zM24,13 h1v1H24zM4 14h1v1H4zM6 14h3v1H6zM10 14h3v1H10zM19 14h1v1H19zM21 14h1v1H21zM23 14h1v1H23zM5 15h1v1H5zM7 15h1v1H7zM11 15h1v1H11zM15 15h2v1H15zM21,15 h4v1H21zM4 16h7v1H4zM12 16h4v1H12zM19 16h1v1H19zM12 17h2v1H12zM15 17h2v1H15zM19 17h1v1H19zM22 17h2v1H22zM4 18h7v1H4zM13 18h2v1H13zM18 18h1v1H18zM20 18h4v1H20zM4 19h1v1H4zM10 19h1v1H10zM13 19h1v1H13zM16 19h1v1H16zM19 19h5v1H19zM4 20h1v1H4zM6 20h3v1H6zM10 20h1v1H10zM12 20h1v1H12zM15 20h1v1H15zM17 20h1v1H17zM20 20h1v1H20zM23 20h1v1H23zM4 21h1v1H4zM6 21h3v1H6zM10 21h1v1H10zM12 21h1v1H12zM15 21h1v1H15zM19 21h1v1H19zM21 21h1v1H21zM4 22h1v1H4zM6 22h3v1H6zM10 22h1v1H10zM12 22h1v1H12zM14 22h2v1H14zM17 22h3v1H17zM4 23h1v1H4zM10 23h1v1H10zM14 23h4v1H14zM22 23h1v1H22zM4 24h7v1H4zM13 24h2v1H13zM16 24h1v1H16zM18 24h2v1H18zM23 24h1v1H23z" shape-rendering="crispEdges"/></svg>`
                          }}
                        />
                      </Box>
                    ) : style.bgStyle === "solid" ? (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1.2,
                        }}
                      >
                        {/* Frame with QR Code */}
                        <Box
                          sx={{
                            p: { xs: 1, sm: 1.2 },
                            bgcolor: "#fff",
                            border: "3px solid #000",
                            borderRadius: 1.5,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 40, sm: 48 },
                              height: { xs: 40, sm: 48 },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: `<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 29 29"><path fill="#FFFFFF" d="M0,0 h29v29H0z" shape-rendering="crispEdges"/><path fill="#000000" d="M4 4h7v1H4zM12 4h2v1H12zM15 4h1v1H15zM18,4 h7v1H18zM4 5h1v1H4zM10 5h1v1H10zM12 5h1v1H12zM15 5h2v1H15zM18 5h1v1H18zM24,5 h1v1H24zM4 6h1v1H4zM6 6h3v1H6zM10 6h1v1H10zM12 6h4v1H12zM18 6h1v1H18zM20 6h3v1H20zM24,6 h1v1H24zM4 7h1v1H4zM6 7h3v1H6zM10 7h1v1H10zM14 7h3v1H14zM18 7h1v1H18zM20 7h3v1H20zM24,7 h1v1H24zM4 8h1v1H4zM6 8h3v1H6zM10 8h1v1H10zM13 8h2v1H13zM18 8h1v1H18zM20 8h3v1H20zM24,8 h1v1H24zM4 9h1v1H4zM10 9h1v1H10zM12 9h5v1H12zM18 9h1v1H18zM24,9 h1v1H24zM4 10h7v1H4zM12 10h1v1H12zM14 10h1v1H14zM16 10h1v1H16zM18,10 h7v1H18zM12 11h2v1H12zM15 11h2v1H15zM6 12h3v1H6zM10 12h1v1H10zM12 12h3v1H12zM16 12h4v1H16zM22,12 h3v1H22zM7 13h2v1H7zM13 13h1v1H13zM15 13h3v1H15zM22 13h1v1H22zM24,13 h1v1H24zM4 14h1v1H4zM6 14h3v1H6zM10 14h3v1H10zM19 14h1v1H19zM21 14h1v1H21zM23 14h1v1H23zM5 15h1v1H5zM7 15h1v1H7zM11 15h1v1H11zM15 15h2v1H15zM21,15 h4v1H21zM4 16h7v1H4zM12 16h4v1H12zM19 16h1v1H19zM12 17h2v1H12zM15 17h2v1H15zM19 17h1v1H19zM22 17h2v1H22zM4 18h7v1H4zM13 18h2v1H13zM18 18h1v1H18zM20 18h4v1H20zM4 19h1v1H4zM10 19h1v1H10zM13 19h1v1H13zM16 19h1v1H16zM19 19h5v1H19zM4 20h1v1H4zM6 20h3v1H6zM10 20h1v1H10zM12 20h1v1H12zM15 20h1v1H15zM17 20h1v1H17zM20 20h1v1H20zM23 20h1v1H23zM4 21h1v1H4zM6 21h3v1H6zM10 21h1v1H10zM12 21h1v1H12zM15 21h1v1H15zM19 21h1v1H19zM21 21h1v1H21zM4 22h1v1H4zM6 22h3v1H6zM10 22h1v1H10zM12 22h1v1H12zM14 22h2v1H14zM17 22h3v1H17zM4 23h1v1H4zM10 23h1v1H10zM14 23h4v1H14zM22 23h1v1H22zM4 24h7v1H4zM13 24h2v1H13zM16 24h1v1H16zM18 24h2v1H18zM23 24h1v1H23z" shape-rendering="crispEdges"/></svg>`
                            }}
                          />
                        </Box>
                        {/* Solid caption below */}
                        <Box
                          sx={{
                            px: 2,
                            py: 0.6,
                            fontSize: { xs: 9, sm: 10 },
                            fontWeight: 700,
                            bgcolor: "#000",
                            color: "#fff",
                            borderRadius: 1.5,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                          }}
                        >
                          Scan!
                        </Box>
                      </Box>
                    ) : (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 1.2,
                        }}
                      >
                        {/* Frame with QR Code */}
                        <Box
                          sx={{
                            p: { xs: 1, sm: 1.2 },
                            bgcolor: "#fff",
                            border: "3px solid #000",
                            borderRadius: 1.5,
                            boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
                          }}
                        >
                          <Box
                            sx={{
                              width: { xs: 40, sm: 48 },
                              height: { xs: 40, sm: 48 },
                            }}
                            dangerouslySetInnerHTML={{
                              __html: `<svg xmlns="http://www.w3.org/2000/svg" height="100%" width="100%" viewBox="0 0 29 29"><path fill="#FFFFFF" d="M0,0 h29v29H0z" shape-rendering="crispEdges"/><path fill="#000000" d="M4 4h7v1H4zM12 4h2v1H12zM15 4h1v1H15zM18,4 h7v1H18zM4 5h1v1H4zM10 5h1v1H10zM12 5h1v1H12zM15 5h2v1H15zM18 5h1v1H18zM24,5 h1v1H24zM4 6h1v1H4zM6 6h3v1H6zM10 6h1v1H10zM12 6h4v1H12zM18 6h1v1H18zM20 6h3v1H20zM24,6 h1v1H24zM4 7h1v1H4zM6 7h3v1H6zM10 7h1v1H10zM14 7h3v1H14zM18 7h1v1H18zM20 7h3v1H20zM24,7 h1v1H24zM4 8h1v1H4zM6 8h3v1H6zM10 8h1v1H10zM13 8h2v1H13zM18 8h1v1H18zM20 8h3v1H20zM24,8 h1v1H24zM4 9h1v1H4zM10 9h1v1H10zM12 9h5v1H12zM18 9h1v1H18zM24,9 h1v1H24zM4 10h7v1H4zM12 10h1v1H12zM14 10h1v1H14zM16 10h1v1H16zM18,10 h7v1H18zM12 11h2v1H12zM15 11h2v1H15zM6 12h3v1H6zM10 12h1v1H10zM12 12h3v1H12zM16 12h4v1H16zM22,12 h3v1H22zM7 13h2v1H7zM13 13h1v1H13zM15 13h3v1H15zM22 13h1v1H22zM24,13 h1v1H24zM4 14h1v1H4zM6 14h3v1H6zM10 14h3v1H10zM19 14h1v1H19zM21 14h1v1H21zM23 14h1v1H23zM5 15h1v1H5zM7 15h1v1H7zM11 15h1v1H11zM15 15h2v1H15zM21,15 h4v1H21zM4 16h7v1H4zM12 16h4v1H12zM19 16h1v1H19zM12 17h2v1H12zM15 17h2v1H15zM19 17h1v1H19zM22 17h2v1H22zM4 18h7v1H4zM13 18h2v1H13zM18 18h1v1H18zM20 18h4v1H20zM4 19h1v1H4zM10 19h1v1H10zM13 19h1v1H13zM16 19h1v1H16zM19 19h5v1H19zM4 20h1v1H4zM6 20h3v1H6zM10 20h1v1H10zM12 20h1v1H12zM15 20h1v1H15zM17 20h1v1H17zM20 20h1v1H20zM23 20h1v1H23zM4 21h1v1H4zM6 21h3v1H6zM10 21h1v1H10zM12 21h1v1H12zM15 21h1v1H15zM19 21h1v1H19zM21 21h1v1H21zM4 22h1v1H4zM6 22h3v1H6zM10 22h1v1H10zM12 22h1v1H12zM14 22h2v1H14zM17 22h3v1H17zM4 23h1v1H4zM10 23h1v1H10zM14 23h4v1H14zM22 23h1v1H22zM4 24h7v1H4zM13 24h2v1H13zM16 24h1v1H16zM18 24h2v1H18zM23 24h1v1H23z" shape-rendering="crispEdges"/></svg>`
                            }}
                          />
                        </Box>
                        {/* "Scan!" Text below frame */}
                        <Box
                          sx={{
                            fontSize: { xs: 9, sm: 10 },
                            fontWeight: 700,
                            color: "#000",
                          }}
                        >
                          Scan!
                        </Box>
                      </Box>
                    )}
                  </Box>
                ))}
              </Box>
            </Box>
          )}

          {/* Frame Border Toggle */}
          {caption && (
            <Box>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={showFrame}
                    onChange={(e) => setShowFrame(e.target.checked)}
                    sx={{
                      color: "primary.main",
                      "&.Mui-checked": {
                        color: "primary.main",
                      },
                    }}
                  />
                }
                label={
                  <Typography sx={{ fontWeight: 600 }}>
                    Show border frame around QR code
                  </Typography>
                }
              />
            </Box>
          )}

          {/* Color Scheme Selection */}
          <Box>
            <Typography gutterBottom sx={{ fontWeight: 600, mb: 2 }}>
              Color Scheme
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: { xs: 1.5, sm: 2 } }}>
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
                    px: { xs: 1.5, sm: 2.5 },
                    py: { xs: 1, sm: 1.5 },
                    height: "auto",
                    fontSize: { xs: "0.8rem", sm: "0.9rem" },
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                    "&::before": {
                      content: '""',
                      display: "inline-block",
                      width: { xs: 12, sm: 16 },
                      height: { xs: 12, sm: 16 },
                      borderRadius: "50%",
                      bgcolor: scheme.bgColor,
                      border: `2px solid ${scheme.fgColor}`,
                      mr: { xs: 0.5, sm: 1 },
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
                p: { xs: 2, md: 4 },
                overflow: "auto",
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 2,
                  maxWidth: "100%",
                }}
              >
                <Box
                  ref={qrRef}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 0.5, // Small gap between QR and caption
                    maxWidth: "100%",
                    "& > svg": {
                      maxWidth: "100%",
                      height: "auto",
                    },
                    ...(showFrame && {
                      p: { xs: `${captionStyle.framePadding / 2}px`, md: `${captionStyle.framePadding}px` },
                      bgcolor: selectedScheme.bgColor,
                      border: { xs: `4px solid ${selectedScheme.fgColor}`, md: `8px solid ${selectedScheme.fgColor}` },
                      borderRadius: { xs: `${captionStyle.frameRadius / 2}px`, md: `${captionStyle.frameRadius}px` },
                    }),
                    ...(!showFrame && {
                      bgcolor: selectedScheme.displayBg,
                    }),
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
                  {showCaption && caption && captionStyle.id !== "none" && (
                    <Box
                      sx={{
                        width: "100%",
                        maxWidth: qrSize,
                        px: { xs: 2, sm: 3 },
                        py: { xs: 2, sm: 3 },
                        fontWeight: 700,
                        fontSize: { xs: "0.9rem", sm: "1rem", md: "1.1rem" },
                        lineHeight: { xs: 1.3, md: 1.5 },
                        textAlign: "center",
                        wordWrap: "break-word",
                        whiteSpace: "pre-wrap",
                        boxSizing: "border-box",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        ...(captionStyle.bgStyle === "solid" && {
                          bgcolor: selectedScheme.fgColor,
                          color: selectedScheme.bgColor,
                          borderRadius: { xs: `${captionStyle.borderRadius / 2}px`, md: `${captionStyle.borderRadius}px` },
                        }),
                        ...(captionStyle.bgStyle === "minimal" && {
                          color: selectedScheme.fgColor,
                          bgcolor: "transparent",
                        }),
                      }}
                    >
                      {caption}
                    </Box>
                  )}
                </Box>
              </Box>
            </Box>
          )}

          {/* Download Buttons */}
          {text && (
            <Box
              sx={{
                bgcolor: "background.paper",
                borderRadius: 2,
                p: { xs: 2, sm: 3 },
                border: "2px solid",
                borderColor: "primary.main",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
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
                Choose your preferred format:
              </Typography>
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                endIcon={<ArrowDropDownIcon />}
                onClick={(e) => setAnchorEl(e.currentTarget)}
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
                Download QR Code
              </Button>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={() => setAnchorEl(null)}
                sx={{
                  "& .MuiPaper-root": {
                    borderRadius: 2,
                    minWidth: 200,
                    boxShadow: 3,
                  },
                }}
              >
                <MenuItem
                  onClick={() => {
                    downloadQRCode("png");
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <ImageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>PNG</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    downloadQRCode("jpeg");
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <ImageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>JPEG</ListItemText>
                </MenuItem>
                <MenuItem
                  onClick={() => {
                    downloadQRCode("svg");
                    setAnchorEl(null);
                  }}
                >
                  <ListItemIcon>
                    <ImageIcon fontSize="small" />
                  </ListItemIcon>
                  <ListItemText>SVG</ListItemText>
                </MenuItem>
              </Menu>
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

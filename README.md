# QR Code Generator

A modern, feature-rich QR code generator built with Next.js 16, TypeScript, and Material UI. Generate beautiful QR codes with customizable colors and download them in multiple formats.

![QR Code Generator](https://img.shields.io/badge/Next.js-16.0-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Material UI](https://img.shields.io/badge/Material--UI-Latest-0081CB?style=for-the-badge&logo=mui)

## ✨ Features

- **Real-time QR Code Generation** - Instant QR code creation as you type
- **Customizable Size** - Adjust QR code size from 128px to 512px with an intuitive slider
- **10 Color Schemes** - Choose from carefully selected color combinations that maintain high contrast for optimal scanning:
  - Classic (Black on White)
  - Ocean (Dark Blue on Light Blue)
  - Forest (Dark Green on Light Green)
  - Sunset (Dark Orange on Light Peach)
  - Royal (Deep Purple on Light Purple)
  - Berry (Dark Pink on Light Pink)
  - Night (White on Dark Gray - inverted)
  - Mint (Dark Teal on Light Mint)
  - Coral (Dark Red-Orange on Light Coral)
  - Lavender (Dark Indigo on Light Lavender)
- **Multiple Export Formats** - Download your QR codes in:
  - PNG (with transparency support)
  - JPEG (with solid background)
  - SVG (vector format for scalability)
- **Modern UI/UX** - Beautiful gradient background with Material Design components
- **Responsive Design** - Works seamlessly on desktop and mobile devices
- **High Error Correction** - Level H error correction for maximum reliability

## 🚀 Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, pnpm, or bun

### Installation

1. Clone the repository or navigate to the project directory:

```bash
cd qr-code-app
```

2. Install dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

4. Open [http://localhost:3000](http://localhost:3000) (or the port shown in your terminal) in your browser to see the application.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **UI Library**: [Material UI (MUI)](https://mui.com/)
- **QR Code Generation**: [qrcode.react](https://github.com/zpao/qrcode.react)
- **Styling**: Emotion (CSS-in-JS via MUI)
- **Build Tool**: Turbopack

## 📁 Project Structure

```
qr-code-app/
├── src/
│   ├── app/
│   │   ├── page.tsx          # Main page component
│   │   ├── layout.tsx        # Root layout with metadata
│   │   ├── theme.ts          # Material UI theme configuration
│   │   └── globals.css       # Global styles
│   └── components/
│       └── QRCodeGenerator.tsx  # Main QR code generator component
├── public/                   # Static assets
├── package.json
├── tsconfig.json            # TypeScript configuration
└── README.md
```

## 🎨 Usage

1. **Enter Text**: Type any text or URL into the input field
2. **Adjust Size**: Use the slider to set your desired QR code size (128px - 512px)
3. **Choose Colors**: Select from 10 pre-designed color schemes that ensure readability
4. **Download**: Click on your preferred format (PNG, JPEG, or SVG) to download the QR code

## 🌟 Key Features Explained

### Color Scheme Selection

All color combinations are designed with high contrast ratios to ensure QR codes remain scannable regardless of the color scheme chosen.

### Download Formats

- **PNG**: Best for web use, supports transparency
- **JPEG**: Smaller file size, solid background
- **SVG**: Vector format, perfect for print and scalability

### Size Customization

The size slider allows precise control over QR code dimensions, making it suitable for various use cases from small icons to large prints.

## 🔧 Development

### Build for Production

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
```

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

## 📧 Support

If you have any questions or need help, please open an issue in the repository.

---

Built with ❤️ using Next.js and Material UI

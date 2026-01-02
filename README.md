# DIGITL - Web Version

A web-based implementation of the DIGITL math puzzle game built with React and Vite.

## Features

- **Daily Challenge**: Complete three puzzles of increasing difficulty levels
- **Sandbox Mode**: Generate random puzzles at your selected difficulty level
- **Multiple Difficulty Levels**: Easy (4 tiles), Medium (5 tiles), and Hard (6 tiles)
- **Calculator-style UI**: Authentic calculator display aesthetics
- **Responsive Design**: Fixed container layout for consistent scaling

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

### Development

Run the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Building for Production

Build the production bundle:
```bash
npm run build
```

The built files will be in the `dist/` directory.

### Preview Production Build

Preview the production build locally:
```bash
npm run preview
```

## Project Structure

```
web-react/
├── src/
│   ├── assets/          # Fonts, SVGs, and puzzle data
│   ├── components/      # Reusable React components
│   ├── constants/       # Constants and configuration
│   ├── screens/         # Main screen components
│   ├── styles/          # Style utilities
│   ├── utils/           # Utility functions
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── types.ts         # TypeScript type definitions
├── dist/                # Production build output
├── index.html           # HTML template
├── package.json         # Dependencies and scripts
├── tsconfig.json        # TypeScript configuration
└── vite.config.ts       # Vite configuration
```

## Technologies Used

- **React 18**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool and dev server
- **CSS-in-JS**: Inline styles for component styling

## Deployment

This project is configured for easy deployment to Vercel. See [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md) for detailed deployment instructions.

### Quick Deploy to Vercel

1. Push your code to GitHub/GitLab/Bitbucket
2. Import your repository in [Vercel](https://vercel.com)
3. Vercel will auto-detect the settings
4. Click Deploy!

The `vercel.json` file is already configured for optimal deployment.

## License

[Add your license here]


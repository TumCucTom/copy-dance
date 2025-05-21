# Copy Dance Game

A improved, web-based implementation of the "Copy Dance" mini-game from 1-2 Switch, where players take turns copying each other's poses using webcam pose tracking. Enhanced by tracking all limbs instead of just joycon position.

## Features

- Real-time pose tracking using MediaPipe
- Pose comparison using cosine similarity
- Score calculation based on pose accuracy
- Modern UI with Tailwind CSS
- TypeScript support

## Setup

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm start
```

3. Open your browser to `http://localhost:3000`

## How to Play

1. Two players take turns being the "poser" and "copier"
2. The poser strikes a pose when prompted
3. The copier has to copy the pose as accurately as possible
4. The game tracks 3 rounds for each player
5. Scores are calculated based on how well the poses match

## Technical Details

- Uses MediaPipe Pose for real-time pose tracking
- Normalizes poses relative to the nose position to make comparison position-independent
- Uses cosine similarity to compare poses
- Built with React and TypeScript
- Styled with Tailwind CSS

## Requirements

- Modern web browser with webcam support
- Node.js 14+ and npm 
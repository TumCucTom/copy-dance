import React, { useState, useRef, useEffect } from 'react';
import { Pose } from '@mediapipe/pose';
import { Camera } from '@mediapipe/camera_utils';
import { drawConnectors, drawLandmarks } from '@mediapipe/drawing_utils';
import { calculatePoseSimilarity } from './utils/poseUtils';

interface PoseData {
  timestamp: number;
  landmarks: any[];
}

const App: React.FC = () => {
  const [gameState, setGameState] = useState<'waiting' | 'posing' | 'copying' | 'scoring'>('waiting');
  const [currentRound, setCurrentRound] = useState(1);
  const [currentPlayer, setCurrentPlayer] = useState<'player1' | 'player2'>('player1');
  const [score, setScore] = useState<number>(0);
  const [message, setMessage] = useState('Get ready to play!');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const poseRef = useRef<Pose | null>(null);
  const poseDataRef = useRef<PoseData[]>([]);
  const referencePoseRef = useRef<PoseData[]>([]);

  useEffect(() => {
    if (!videoRef.current || !canvasRef.current) return;

    poseRef.current = new Pose({
      locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
      }
    });

    poseRef.current.setOptions({
      modelComplexity: 1,
      smoothLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    poseRef.current.onResults((results) => {
      if (!canvasRef.current) return;
      
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      // Clear canvas
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw video frame
      ctx.drawImage(results.image, 0, 0, canvasRef.current.width, canvasRef.current.height);
      
      // Draw pose landmarks
      drawConnectors(ctx, results.poseLandmarks, results.POSE_CONNECTIONS, { color: '#00FF00', lineWidth: 2 });
      drawLandmarks(ctx, results.poseLandmarks, { color: '#FF0000', lineWidth: 1 });

      // Store pose data if we're in posing or copying state
      if (gameState === 'posing' || gameState === 'copying') {
        poseDataRef.current.push({
          timestamp: Date.now(),
          landmarks: results.poseLandmarks
        });
      }
    });

    const camera = new Camera(videoRef.current, {
      onFrame: async () => {
        if (poseRef.current) {
          await poseRef.current.send({ image: videoRef.current! });
        }
      },
      width: 640,
      height: 480
    });

    camera.start();

    return () => {
      camera.stop();
      if (poseRef.current) {
        poseRef.current.close();
      }
    };
  }, []);

  const startRound = () => {
    setGameState('posing');
    setMessage('Player 1: Strike a pose!');
    poseDataRef.current = [];
    setTimeout(() => {
      setGameState('copying');
      setMessage('Player 2: Copy the pose!');
      referencePoseRef.current = [...poseDataRef.current];
      poseDataRef.current = [];
    }, 3000);
  };

  const calculateScore = () => {
    const similarity = calculatePoseSimilarity(referencePoseRef.current, poseDataRef.current);
    setScore(similarity);
    setGameState('scoring');
    setMessage(`Score: ${Math.round(similarity * 100)}%`);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="max-w-4xl w-full bg-white rounded-lg shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center mb-6">Copy Dance Game</h1>
        
        <div className="relative mb-4">
          <video
            ref={videoRef}
            className="w-full rounded-lg"
            style={{ display: 'none' }}
          />
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg"
            width={640}
            height={480}
          />
        </div>

        <div className="text-center mb-4">
          <p className="text-xl font-semibold">{message}</p>
          <p className="text-lg">Round: {currentRound}/3</p>
          <p className="text-lg">Current Player: {currentPlayer === 'player1' ? 'Player 1' : 'Player 2'}</p>
          {score > 0 && <p className="text-lg">Score: {Math.round(score * 100)}%</p>}
        </div>

        <div className="flex justify-center">
          <button
            onClick={startRound}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            disabled={gameState !== 'waiting'}
          >
            Start Round
          </button>
        </div>
      </div>
    </div>
  );
};

export default App; 
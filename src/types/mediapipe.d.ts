declare module '@mediapipe/camera_utils' {
  export class Camera {
    constructor(video: HTMLVideoElement, options: {
      onFrame: () => Promise<void>;
      width?: number;
      height?: number;
    });
    start(): void;
    stop(): void;
  }
}

declare module '@mediapipe/drawing_utils' {
  export function drawConnectors(
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    connections: any[],
    options?: { color?: string; lineWidth?: number }
  ): void;
  
  export function drawLandmarks(
    ctx: CanvasRenderingContext2D,
    landmarks: any[],
    options?: { color?: string; lineWidth?: number }
  ): void;
}

declare module '@mediapipe/pose' {
  export interface Results {
    image: HTMLCanvasElement | HTMLImageElement;
    poseLandmarks: any[];
  }

  export interface ResultsListener {
    (results: Results): void;
  }

  export class Pose {
    constructor(options: {
      locateFile: (file: string) => string;
    });
    setOptions(options: {
      modelComplexity?: number;
      smoothLandmarks?: boolean;
      minDetectionConfidence?: number;
      minTrackingConfidence?: number;
    }): void;
    onResults(listener: ResultsListener): void;
    send(options: { image: HTMLVideoElement | HTMLImageElement }): Promise<void>;
    close(): void;
  }

  export const POSE_CONNECTIONS: any[];
} 
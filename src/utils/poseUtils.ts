interface PoseData {
  timestamp: number;
  landmarks: any[];
}

// Convert landmarks to relative positions based on nose position
const normalizeLandmarks = (landmarks: any[]) => {
  if (!landmarks || landmarks.length === 0) return [];
  
  const nose = landmarks[0]; // MediaPipe Pose uses nose as landmark 0
  return landmarks.map(landmark => ({
    x: landmark.x - nose.x,
    y: landmark.y - nose.y,
    z: landmark.z - nose.z,
    visibility: landmark.visibility
  }));
};

// Calculate cosine similarity between two vectors
const cosineSimilarity = (vec1: number[], vec2: number[]): number => {
  if (vec1.length !== vec2.length) return 0;
  
  const dotProduct = vec1.reduce((sum, val, i) => sum + val * vec2[i], 0);
  const magnitude1 = Math.sqrt(vec1.reduce((sum, val) => sum + val * val, 0));
  const magnitude2 = Math.sqrt(vec2.reduce((sum, val) => sum + val * val, 0));
  
  return dotProduct / (magnitude1 * magnitude2);
};

// Convert landmarks to a flat array of coordinates
const landmarksToVector = (landmarks: any[]): number[] => {
  return landmarks.flatMap(landmark => [landmark.x, landmark.y, landmark.z]);
};

// Calculate similarity between two poses
export const calculatePoseSimilarity = (referencePoses: PoseData[], currentPoses: PoseData[]): number => {
  if (referencePoses.length === 0 || currentPoses.length === 0) return 0;

  // Get the most stable pose from each set (middle frame)
  const referencePose = referencePoses[Math.floor(referencePoses.length / 2)];
  const currentPose = currentPoses[Math.floor(currentPoses.length / 2)];

  // Normalize landmarks relative to nose position
  const normalizedReference = normalizeLandmarks(referencePose.landmarks);
  const normalizedCurrent = normalizeLandmarks(currentPose.landmarks);

  // Convert to vectors
  const referenceVector = landmarksToVector(normalizedReference);
  const currentVector = landmarksToVector(normalizedCurrent);

  // Calculate similarity
  return cosineSimilarity(referenceVector, currentVector);
}; 
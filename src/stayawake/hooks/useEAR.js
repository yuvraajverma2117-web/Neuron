import { useRef, useState, useCallback, useEffect } from 'react';
import {
  EAR_THRESHOLD, EAR_CONSEC_FRAMES, EAR_SMOOTHING_FRAMES,
  MAR_THRESHOLD, NOD_THRESHOLD, DROWSY_DELAY_MS,
  LEFT_EYE, RIGHT_EYE, MOUTH_TOP, MOUTH_BOTTOM, MOUTH_LEFT, MOUTH_RIGHT, NOSE_TIP,
} from '../constants';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);

function calcEAR(lm, indices) {
  const [p1, p2, p3, p4, p5, p6] = indices.map(i => lm[i]);
  return (dist(p2, p6) + dist(p3, p5)) / (2 * dist(p1, p4));
}

function calcMAR(lm) {
  return dist(lm[MOUTH_TOP], lm[MOUTH_BOTTOM]) /
    (dist(lm[MOUTH_LEFT], lm[MOUTH_RIGHT]) + 1e-6);
}

export function useEAR(videoRef) {
  const [status, setStatus] = useState('LOADING'); // LOADING | NO_FACE | ALERT | DROWSY | ASLEEP
  const [metrics, setMetrics] = useState({ ear: 1, mar: 0, nod: false, yawn: false });
  const [faceDetected, setFaceDetected] = useState(false);

  const faceMeshRef = useRef(null);
  const cameraRef = useRef(null);
  const earBuffer = useRef([]);
  const consecLowFrames = useRef(0);
  const drowsyTimerRef = useRef(null);
  const noseBaselineRef = useRef(null);
  const onDrowsyRef = useRef(null); // callback set by useDrowsiness

  // expose so useDrowsiness can subscribe
  const setOnDrowsy = useCallback((fn) => { onDrowsyRef.current = fn; }, []);

  const onResults = useCallback((results) => {
    if (!results.multiFaceLandmarks || results.multiFaceLandmarks.length === 0) {
      setFaceDetected(false);
      setStatus('NO_FACE');
      return;
    }
    setFaceDetected(true);
    const lm = results.multiFaceLandmarks[0];

    const leftEAR = calcEAR(lm, LEFT_EYE);
    const rightEAR = calcEAR(lm, RIGHT_EYE);
    const ear = (leftEAR + rightEAR) / 2;

    earBuffer.current.push(ear);
    if (earBuffer.current.length > EAR_SMOOTHING_FRAMES) earBuffer.current.shift();
    const smoothEAR = earBuffer.current.reduce((a, b) => a + b, 0) / earBuffer.current.length;

    const mar = calcMAR(lm);
    const yawn = mar > MAR_THRESHOLD;

    // head nod
    const noseY = lm[NOSE_TIP].y;
    if (!noseBaselineRef.current) noseBaselineRef.current = noseY;
    const nod = (noseY - noseBaselineRef.current) > NOD_THRESHOLD;

    setMetrics({ ear: smoothEAR, mar, nod, yawn });

    if (smoothEAR < EAR_THRESHOLD || nod) {
      consecLowFrames.current++;
    } else {
      consecLowFrames.current = 0;
      if (drowsyTimerRef.current) {
        clearTimeout(drowsyTimerRef.current);
        drowsyTimerRef.current = null;
      }
    }

    let newStatus = 'ALERT';
    if (consecLowFrames.current > EAR_CONSEC_FRAMES * 1.5 || yawn) {
      newStatus = 'ASLEEP';
    } else if (consecLowFrames.current > EAR_CONSEC_FRAMES * 0.6) {
      newStatus = 'DROWSY';
    }

    setStatus(newStatus);

    // fire callback after sustained drowsiness
    if (newStatus === 'ASLEEP' && !drowsyTimerRef.current) {
      drowsyTimerRef.current = setTimeout(() => {
        drowsyTimerRef.current = null;
        onDrowsyRef.current?.();
      }, DROWSY_DELAY_MS);
    }
  }, []);

  const start = useCallback(async () => {
    if (!videoRef.current || !window.FaceMesh) return;

    const faceMesh = new window.FaceMesh({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/face_mesh/${file}`,
    });
    faceMesh.setOptions({
      maxNumFaces: 1,
      refineLandmarks: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });
    faceMesh.onResults(onResults);
    faceMeshRef.current = faceMesh;

    const camera = new window.Camera(videoRef.current, {
      onFrame: async () => {
        if (videoRef.current) await faceMesh.send({ image: videoRef.current });
      },
      width: 320,
      height: 240,
    });
    cameraRef.current = camera;
    await camera.start();
    setStatus('ALERT');
  }, [videoRef, onResults]);

  const stop = useCallback(() => {
    cameraRef.current?.stop();
    faceMeshRef.current?.close();
    cameraRef.current = null;
    faceMeshRef.current = null;
    setStatus('LOADING');
  }, []);

  useEffect(() => () => stop(), [stop]);

  return { status, metrics, faceDetected, start, stop, setOnDrowsy };
}

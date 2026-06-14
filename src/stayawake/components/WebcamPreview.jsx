import React from 'react';

export default function WebcamPreview({ videoRef, faceDetected, status }) {
  const borderColor =
    status === 'ALERT'  ? 'border-emerald-500' :
    status === 'DROWSY' ? 'border-orange-500' :
    status === 'ASLEEP' ? 'border-red-500' : 'border-gray-600';

  return (
    <div className={`relative rounded-xl overflow-hidden border-2 ${borderColor} shadow-lg`}
         style={{ width: 180, height: 135 }}>
      <video
        ref={videoRef}
        autoPlay
        muted
        playsInline
        className="w-full h-full object-cover scale-x-[-1]"
      />
      {!faceDetected && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 text-xs text-yellow-400 text-center px-2">
          Point camera at your face
        </div>
      )}
      <div className="absolute bottom-1 left-1 text-[10px] bg-black/50 text-white px-1 rounded">
        🔒 Local only
      </div>
    </div>
  );
}

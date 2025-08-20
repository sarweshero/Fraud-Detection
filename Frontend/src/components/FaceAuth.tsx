import React, { useRef, useState, useEffect } from 'react';

interface FaceAuthProps {
  onAuthSuccess: () => void;
}

export const FaceAuth: React.FC<FaceAuthProps> = ({ onAuthSuccess }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ video: true })
      .then(stream => {
        if (videoRef.current) videoRef.current.srcObject = stream;
      })
      .catch(err => setError('Camera error: ' + err.message));
  }, []);

  const handleAuthenticate = async () => {
    setLoading(true);
    setError('');
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext('2d')?.drawImage(videoRef.current, 0, 0);
    canvas.toBlob(async (blob) => {
      if (!blob) {
        setError('Failed to capture image.');
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append('file', blob, 'face.jpg');
      try {
        const res = await fetch('http://localhost:8000/face-auth', {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (data.authenticated) {
          // Stop the webcam stream
          if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject as MediaStream;
            stream.getTracks().forEach(track => track.stop());
          }
          onAuthSuccess();
        } else {
          setError('Face not recognized.');
        }
      } catch (e) {
        setError('Server error.');
      }
      setLoading(false);
    }, 'image/jpeg');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-100">
      <h2 className="text-2xl font-bold mb-4">Face Authentication Required</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <video ref={videoRef} autoPlay muted width={320} height={240} className="rounded shadow mb-4" />
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
        onClick={handleAuthenticate}
        disabled={loading}
      >
        {loading ? 'Authenticating...' : 'Authenticate'}
      </button>
    </div>
  );
};

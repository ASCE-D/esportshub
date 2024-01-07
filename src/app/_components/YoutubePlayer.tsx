import React, { useState, useEffect } from "react";
import YouTube from "react-youtube";

interface YouTubePlayerProps {
  videoId?: string;
  onNextVideo: () => void;
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onNextVideo }) => {
  const [showNextVideoMessage, setShowNextVideoMessage] = useState(false);

  const onReady = (event: { target: any }) => {
    const player = event.target as any;
    player.playVideo();
  };

  const onStateChange = (event: { target: any; data: number }) => {
    if (event.data === 0) {
      // Video ended
      setShowNextVideoMessage(true);

      // Wait for 5 seconds and then trigger the next video
      setTimeout(() => {
        setShowNextVideoMessage(false);
        onNextVideo();
      }, 5000);
    }
  };

  const onError = (error: any) => {
    console.error("YouTube Player Error:", error);
  };

  // Assuming a 16:9 aspect ratio
  const aspectRatio = 16 / 9;

  return (
    <div style={{ width: '1080px', height: '1920px', position: 'relative', overflow: 'hidden' }}>
      {showNextVideoMessage && <p>Next video in 5 seconds...</p>}
      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <YouTube
          videoId={videoId}
          onReady={onReady}
          onError={onError}
          onStateChange={onStateChange}
          opts={{
            width: '1080',
            height: `${1920 / aspectRatio}`, // Calculate height based on aspect ratio
          }}
        />
      </div>
    </div>
  );
};

export default YouTubePlayer;




// "use client"
// import React, { useState, useEffect } from "react";
// import YouTube from "react-youtube";

// interface YouTubePlayerProps {
//   videoId?: string;
//   onNextVideo: () => void;
// }

// const YouTubePlayer: React.FC<YouTubePlayerProps> = ({ videoId, onNextVideo }) => {
//   const [showNextVideoMessage, setShowNextVideoMessage] = useState(false);

//   const onReady = (event: { target: any }) => {
//     const player = event.target as any;
//     player.playVideo();
//   };

//   const onStateChange = (event: { target: any; data: number }) => {
//     if (event.data === 0) {
//       // Video ended
//       setShowNextVideoMessage(true);

//       // Wait for 5 seconds and then trigger the next video
//       setTimeout(() => {
//         setShowNextVideoMessage(false);
//         onNextVideo();
//       }, 5000);
//     }
//   };

//   const onError = (error: any) => {
//     console.error("YouTube Player Error:", error);
//   };

//   return (
//     <div>
//       {showNextVideoMessage && <p>Next video in 5 seconds...</p>}
//       <YouTube
//         videoId={videoId}
//         onReady={onReady}
//         onError={onError}
//         onStateChange={onStateChange}
//         className="w-full max-w-2xl"
//       />
//     </div>
//   );
// };

// export default YouTubePlayer;


import React, { useRef, useEffect } from "react";

const Canvas = ({ analyserRef }) => {
  const canvasRef = useRef(null);
  const blocksRef = useRef([]);
  const lastBlockCreationRef = useRef(0);
  const animationRef = useRef(null);
  const blockCreationInterval = 500; // 시간 간격 조정 (ms 단위)

  useEffect(() => {
    const canvas = canvasRef.current;
    const canvasContext = canvas.getContext("2d");
    const analyser = analyserRef.current;

    if (!analyser) return;

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    const WIDTH = canvas.width;
    const HEIGHT = canvas.height;

    const blockWidth = 2;
    const blockSpacing = 0.5;
    const scrollSpeed = 20;

    const draw = () => {
      analyser.getByteFrequencyData(dataArray);

      let sum = 0;
      for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
      }
      const averageAmplitude = sum / dataArray.length;

      const blockHeight =
        averageAmplitude > 10 ? (averageAmplitude / 200) * HEIGHT : 1;

      const now = Date.now();
      if (now - lastBlockCreationRef.current > blockCreationInterval) {
        blocksRef.current.push({
          x: 300,
          height: blockHeight,
        });
        lastBlockCreationRef.current = now;
      }

      canvasContext.clearRect(0, 0, WIDTH, HEIGHT);

      //   // 항상 1px 높이로 채워지는 기본 블록
      //   for (let x = 0; x < WIDTH; x += blockWidth + blockSpacing) {
      //     const blockCenterY = HEIGHT / 2;
      //     canvasContext.fillStyle = "#000000"; // 1px 높이 블록을 구분하기 위한 색상
      //     canvasContext.fillRect(
      //       x,
      //       blockCenterY - 0.5, // 중심에서 위아래로 1px만큼 그리기
      //       blockWidth,
      //       1 // 높이 1px
      //     );
      //   }

      blocksRef.current.forEach((block) => {
        const blockCenterY = HEIGHT / 2;
        canvasContext.fillStyle = "#000000";

        canvasContext.fillRect(
          block.x,
          blockCenterY - block.height / 2,
          blockWidth,
          block.height
        );

        block.x -= (blockWidth + blockSpacing) / scrollSpeed;
      });

      blocksRef.current = blocksRef.current.filter(
        (block) => block.x + blockWidth + blockSpacing > 0
      );

      animationRef.current = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [analyserRef]);

  return <canvas className="w-[100hv]" ref={canvasRef} height={200} />;
};

export default Canvas;

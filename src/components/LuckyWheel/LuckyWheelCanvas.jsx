import { useEffect, useRef } from "react";

export const LuckyWheelCanvas = ({
    rotation,
    wheelItems,
    wheelImagePath,
    wheelRadius,
    wheelDiameter,
}) => {
    const canvasRef = useRef(null); // Canvas 引用

    // 繪製輪盤
    useEffect(() => {
        const drawWheel = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空畫布

            // 如果有底圖，則畫底圖
            if (wheelImagePath) {
                const img = new Image();
                img.src = wheelImagePath;
                img.onload = () => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, wheelRadius, 0, 2 * Math.PI);
                    ctx.clip();
                    ctx.globalAlpha = 0.5; // 設定不透明度為 0.5
                    ctx.drawImage(
                        img,
                        centerX - wheelRadius,
                        centerY - wheelRadius,
                        wheelDiameter,
                        wheelDiameter
                    );
                    ctx.restore();
                    drawWheelSegments(); // 畫輪盤分段
                };
            } else {
                drawWheelSegments(); // 畫輪盤分段
            }

            // 畫輪盤的分段
            function drawWheelSegments() {
                const segmentAngle = (2 * Math.PI) / wheelItems.length;

                wheelItems.forEach((wheelItem, index) => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.moveTo(centerX, centerY);
                    ctx.arc(
                        centerX,
                        centerY,
                        wheelRadius,
                        index * segmentAngle + rotation,
                        (index + 1) * segmentAngle + rotation
                    );
                    ctx.closePath();

                    // 設定顏色
                    if (!wheelImagePath) {
                        ctx.fillStyle = index % 2 === 0 ? "#FFD700" : "#FFA500";
                        ctx.fill();
                    }
                    ctx.strokeStyle = "#E5E7EB"; // 淡灰色線條
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // 計算文字大小
                    const maxFontSize = wheelRadius / (wheelItem.length * 0.8); // 根據文字長度計算文字大小
                    const fontSize = Math.min(maxFontSize, 25); // 設定最大字體大小為 25

                    // 畫文字
                    ctx.translate(centerX, centerY);
                    ctx.rotate(
                        index * segmentAngle + segmentAngle / 2 + rotation
                    );
                    ctx.textAlign = "right";
                    ctx.fillStyle = "#000";
                    ctx.font = `${fontSize}px Arial`;
                    ctx.fillText(wheelItem, wheelRadius - 15, 5);
                    ctx.restore();
                });

                // 畫指針
                ctx.beginPath();
                ctx.moveTo(centerX + wheelRadius - 20, centerY);
                ctx.lineTo(centerX + wheelRadius, centerY - 10);
                ctx.lineTo(centerX + wheelRadius, centerY + 10);
                ctx.closePath();
                ctx.fillStyle = "#FF0000";
                ctx.fill();
            }
        };

        drawWheel();
    }, [rotation, wheelItems, wheelImagePath, wheelRadius, wheelDiameter]);

    return (
        <div className="flex justify-center">
            <canvas
                ref={canvasRef}
                width={600}
                height={600}
                className="border rounded"
            />
        </div>
    );
};

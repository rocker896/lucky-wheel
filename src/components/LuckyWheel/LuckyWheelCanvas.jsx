import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useRef, useState } from "react";

export const LuckyWheelCanvas = ({
    wheelItems,
    wheelRadius,
    wheelDiameter,
    spinningRotation,
}) => {
    const envWheelImagePath = process.env.NEXT_PUBLIC_DEFAULT_WHEEL_IMAGE_PATH;
    const defaultWheelImagePath = envWheelImagePath ? envWheelImagePath : ""; // 預設輪盤底圖路徑
    const [wheelImagePath, setWheelImagePath] = useState(defaultWheelImagePath);
    const canvasRef = useRef(null); // Canvas 引用
    const fileInputRef = useRef(null); // 檔案輸入框引用

    // 繪製輪盤
    useEffect(() => {
        // 畫輪盤的分段
        const drawWheelSegments = (ctx, centerX, centerY) => {
            const wheelItemsLength = wheelItems.length;
            const segmentAngle = (2 * Math.PI) / wheelItemsLength;
            const sectorColors = [
                "#FA8072", // 鮭魚粉
                "#FFD700", // 金黃色
                "#7FFFD4", // 碧綠色
                "#72DDF7", // 天藍色
                "#9370DB", // 紫色
            ];
            const sectorColorsLength = sectorColors.length;

            wheelItems.forEach((wheelItem, index) => {
                ctx.save();
                ctx.beginPath();
                ctx.moveTo(centerX, centerY);
                ctx.arc(
                    centerX,
                    centerY,
                    wheelRadius,
                    index * segmentAngle + spinningRotation,
                    (index + 1) * segmentAngle + spinningRotation
                );
                ctx.closePath();

                // 設定顏色
                if (!wheelImagePath) {
                    let colorIndex = index % sectorColorsLength;
                    const sectorsPerColor = Math.floor(
                        wheelItemsLength / sectorColorsLength
                    );

                    // 當扇形數量不是顏色數量的整數倍時的特殊處理
                    // 參考 https://tw.piliapp.com/random/wheel/ 的渲染邏輯
                    if (
                        index >= sectorsPerColor * sectorColorsLength &&
                        wheelItemsLength % sectorColorsLength > 0 &&
                        wheelItemsLength % sectorColorsLength < 3
                    ) {
                        colorIndex += 2;
                    }

                    ctx.fillStyle = sectorColors[colorIndex];
                    ctx.fill();
                } else {
                    ctx.strokeStyle = "#4C4C4C"; // 淡灰色線條
                    ctx.lineWidth = 1;
                    ctx.stroke();
                }

                // 計算文字大小
                const maxFontSize = wheelRadius / (wheelItem.length * 0.8); // 根據文字長度計算文字大小
                const fontSize = Math.min(maxFontSize, 25); // 設定最大字體大小為 25

                // 畫文字
                ctx.translate(centerX, centerY);
                ctx.rotate(
                    index * segmentAngle + segmentAngle / 2 + spinningRotation
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
        };

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
                    drawWheelSegments(ctx, centerX, centerY); // 畫輪盤分段
                };
            } else {
                drawWheelSegments(ctx, centerX, centerY); // 畫輪盤分段
            }
        };

        drawWheel();
    }, [
        wheelItems,
        wheelRadius,
        wheelDiameter,
        spinningRotation,
        wheelImagePath,
    ]);

    // 處理圖片上傳
    const handleUploadImage = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const img = new Image();
                img.onload = () => {
                    // 創建臨時 canvas 來調整圖片大小
                    const tempCanvas = document.createElement("canvas");
                    tempCanvas.width = wheelDiameter;
                    tempCanvas.height = wheelDiameter;
                    const tempCtx = tempCanvas.getContext("2d");
                    tempCtx.globalAlpha = 0.5; // 設定不透明度為 0.5

                    // 計算裁剪參數以保持圖片比例並填滿圓形區域
                    const scale = Math.max(
                        wheelDiameter / img.width,
                        wheelDiameter / img.height
                    );
                    const scaledWidth = img.width * scale;
                    const scaledHeight = img.height * scale;
                    const x = (wheelDiameter - scaledWidth) / 2;
                    const y = (wheelDiameter - scaledHeight) / 2;

                    tempCtx.drawImage(img, x, y, scaledWidth, scaledHeight);
                    setWheelImagePath(tempCanvas.toDataURL());
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // 處理底圖清除或重設
    const handleResetImage = (imagePath) => {
        setWheelImagePath(imagePath);
        fileInputRef.current.value = ""; // 清除檔案輸入框的值
    };

    return (
        <>
            <div className="flex justify-center">
                <canvas ref={canvasRef} width={600} height={600} />
            </div>

            <div className="space-y-2">
                <Label htmlFor="wheelImage" className="text-base font-semibold">
                    底圖
                </Label>
                <Input
                    id="wheelImage"
                    type="file"
                    accept="image/*"
                    onChange={handleUploadImage}
                    ref={fileInputRef}
                />
                <div className="isolate flex -space-x-px">
                    <Button
                        className="w-full rounded-r-none focus:z-10"
                        variant="outline"
                        onClick={() => handleResetImage(null)}
                    >
                        清除
                    </Button>
                    <Button
                        className="w-full rounded-l-none focus:z-10"
                        variant="outline"
                        onClick={() => handleResetImage(defaultWheelImagePath)}
                    >
                        重設
                    </Button>
                </div>
            </div>
        </>
    );
};

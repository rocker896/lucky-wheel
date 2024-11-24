"use client";

import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Check, Copy } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

const LuckyWheel = () => {
    // 狀態管理
    const [items, setItems] = useState(["1", "2", "3", "4", "5", "6"]); // 輪盤項目
    const [results, setResults] = useState([]); // 抽獎結果
    const [isSpinning, setIsSpinning] = useState(false); // 是否正在旋轉
    const [rotation, setRotation] = useState(0); // 當前旋轉角度
    const [wheelImage, setWheelImage] = useState(""); // 輪盤底圖
    const [itemsText, setItemsText] = useState(items.join("\n")); // 項目文本
    const [currentResult, setCurrentResult] = useState(null); // 當前結果
    const [notification, setNotification] = useState(null); // 通知訊息
    const canvasRef = useRef(null); // Canvas 引用
    const notificationTimeoutRef = useRef(null); // 通知計時器引用
    const wheelRadius = 150; // 輪盤半徑
    const wheelDiameter = wheelRadius * 2; // 輪盤直徑

    // 畫輪盤的效果
    useEffect(() => {
        const drawWheel = () => {
            const canvas = canvasRef.current;
            const ctx = canvas.getContext("2d");
            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            ctx.clearRect(0, 0, canvas.width, canvas.height); // 清空畫布

            // 如果有底圖，則畫底圖
            if (wheelImage) {
                const img = new Image();
                img.src = wheelImage;
                img.onload = () => {
                    ctx.save();
                    ctx.beginPath();
                    ctx.arc(centerX, centerY, wheelRadius, 0, 2 * Math.PI);
                    ctx.clip();
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
                const segmentAngle = (2 * Math.PI) / items.length;

                items.forEach((item, index) => {
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
                    if (!wheelImage) {
                        ctx.fillStyle = index % 2 === 0 ? "#FFD700" : "#FFA500";
                        ctx.fill();
                    }
                    ctx.strokeStyle = "#E5E7EB"; // 淡灰色線條
                    ctx.lineWidth = 1;
                    ctx.stroke();

                    // 畫文字
                    ctx.translate(centerX, centerY);
                    ctx.rotate(
                        index * segmentAngle + segmentAngle / 2 + rotation
                    );
                    ctx.textAlign = "right";
                    ctx.fillStyle = "#000";
                    ctx.font = "14px Arial";
                    ctx.fillText(item, wheelRadius - 10, 5);
                    ctx.restore();
                });

                // 畫指針
                ctx.beginPath();
                ctx.moveTo(centerX + wheelRadius + 10, centerY);
                ctx.lineTo(centerX + wheelRadius + 30, centerY - 10);
                ctx.lineTo(centerX + wheelRadius + 30, centerY + 10);
                ctx.closePath();
                ctx.fillStyle = "#FF0000";
                ctx.fill();
            }
        };

        drawWheel(); // 畫輪盤
    }, [items, rotation, wheelImage, wheelDiameter]);

    // 處理圖片上傳
    const handleImageUpload = (e) => {
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
                    setWheelImage(tempCanvas.toDataURL());
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // 更新項目文本
    useEffect(() => {
        setItemsText(items.join("\n"));
    }, [items]);

    // 更新項目
    const handleUpdateItems = useCallback(() => {
        if (itemsText.trim()) {
            const newItems = itemsText
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
            setItems(newItems);
        }
    }, [itemsText]);

    // 處理旋轉
    const handleSpin = useCallback(() => {
        if (isSpinning) return;

        setIsSpinning(true);
        setCurrentResult(null);
        const spinDuration = 3000; // 旋轉持續時間
        const startRotation = rotation; // 起始旋轉角度
        const extraSpins = 5; // 額外旋轉次數
        const randomAngle = Math.random() * (2 * Math.PI); // 隨機角度
        const targetRotation =
            startRotation + 2 * Math.PI * extraSpins + randomAngle; // 目標旋轉角度

        const startTime = Date.now();

        const animate = () => {
            const currentTime = Date.now();
            const elapsed = currentTime - startTime;

            if (elapsed < spinDuration) {
                const progress = 1 - Math.pow(1 - elapsed / spinDuration, 3);
                setRotation(
                    startRotation + (targetRotation - startRotation) * progress
                );
                requestAnimationFrame(animate);
            } else {
                setRotation(targetRotation);
                setIsSpinning(false);

                // 計算獲勝項目
                const normalizedRotation = targetRotation % (2 * Math.PI);
                const segmentAngle = (2 * Math.PI) / items.length;
                const winningIndex =
                    items.length -
                    1 -
                    Math.floor(normalizedRotation / segmentAngle);
                const winner = items[winningIndex % items.length];

                const timestamp = new Date().toLocaleString();
                const newResult = { item: winner, time: timestamp };
                setResults((prev) => [...prev, newResult]);
                setCurrentResult(newResult);
            }
        };

        requestAnimationFrame(animate);
    }, [isSpinning, rotation, items]);

    // 清除通知計時器
    useEffect(() => {
        return () => {
            if (notificationTimeoutRef.current) {
                clearTimeout(notificationTimeoutRef.current);
            }
        };
    }, []);

    // 顯示通知
    const showNotification = (message) => {
        setNotification(message);
        if (notificationTimeoutRef.current) {
            clearTimeout(notificationTimeoutRef.current);
        }
        notificationTimeoutRef.current = setTimeout(() => {
            setNotification(null);
        }, 2000);
    };

    // 複製單一結果
    const handleCopyResult = (result) => {
        const textToCopy = `${result.time}: ${result.item}`;
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification("已複製到剪貼簿");
        });
    };

    // 複製所有結果
    const handleCopyAllResults = () => {
        const textToCopy = results
            .map((result) => `${result.time}: ${result.item}`)
            .join("\n");
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification("已複製所有結果到剪貼簿");
        });
    };

    return (
        <div className="flex flex-col space-y-4 p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>幸運輪盤</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    {currentResult && (
                        <Alert className="bg-yellow-100 border-yellow-400">
                            <AlertTitle className="text-xl font-bold text-center">
                                🎉 得獎項目：{currentResult.item} 🎉
                            </AlertTitle>
                        </Alert>
                    )}

                    {notification && (
                        <Alert className="fixed top-4 right-4 z-50 bg-green-100 border-green-400 w-auto">
                            <AlertTitle className="text-green-800 flex items-center gap-2">
                                <Check className="h-4 w-4" />
                                {notification}
                            </AlertTitle>
                        </Alert>
                    )}

                    <div className="flex justify-center">
                        <canvas
                            ref={canvasRef}
                            width={400}
                            height={400}
                            className="border rounded"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="background">更換輪盤底圖</Label>
                        <Input
                            id="background"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="items">編輯項目（每行一個）</Label>
                        <Textarea
                            id="items"
                            value={itemsText}
                            onChange={(e) => setItemsText(e.target.value)}
                            placeholder="輸入項目，每行一個"
                            rows={4}
                            className="w-full"
                        />
                        <Button onClick={handleUpdateItems}>更新項目</Button>
                    </div>

                    <Button
                        onClick={handleSpin}
                        disabled={isSpinning}
                        className="w-full"
                    >
                        {isSpinning ? "旋轉中..." : "開始旋轉"}
                    </Button>

                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">抽獎記錄</h3>
                            {results.length > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleCopyAllResults}
                                    className="flex items-center gap-2"
                                >
                                    <Copy className="h-4 w-4" />
                                    複製所有結果
                                </Button>
                            )}
                        </div>
                        <div className="max-h-40 overflow-y-auto">
                            {results.map((result, index) => (
                                <div
                                    key={index}
                                    className="flex justify-between items-center text-sm py-1 border-b"
                                >
                                    <span>
                                        {result.time}: {result.item}
                                    </span>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => handleCopyResult(result)}
                                        className="h-6 w-6 p-0"
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default LuckyWheel;

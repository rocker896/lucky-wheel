import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useRef, useState } from "react";

export const LuckyWheelControls = ({
    items,
    rotation,
    wheelDiameter,
    defaultWheelItems,
    defaultWheelImagePath,
    setItems,
    setResults,
    setRotation,
    setWheelImage,
    setCurrentResult,
}) => {
    const [itemsText, setItemsText] = useState(items.join("\n")); // 項目文本
    const [isSpinning, setIsSpinning] = useState(false); // 是否正在旋轉
    const fileInputRef = useRef(null); // 新增 ref 來操作檔案輸入框

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
                    setWheelImage(tempCanvas.toDataURL());
                };
                img.src = e.target.result;
            };
            reader.readAsDataURL(file);
        }
    };

    // 處理底圖重設或清除
    const handleResetImage = (wheelImagePath) => {
        setWheelImage(wheelImagePath);
        fileInputRef.current.value = ""; // 清除檔案輸入框的值
    };

    // 處理項目更新
    const handleItemsChange = (e) => {
        const newItemsText = e.target.value;
        setItemsText(newItemsText);
        const newItems = newItemsText
            .split("\n")
            .map((item) => item.trim())
            .filter((item) => item.length > 0);
        setItems(newItems);
    };

    // 處理項目重設
    const handleResetToDefaultItems = () => {
        setItems(defaultWheelItems);
        setItemsText(defaultWheelItems.join("\n"));
        setRotation(0); // 重置旋轉角度
    };

    // 處理抽獎
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
    }, [
        isSpinning,
        items,
        rotation,
        setResults,
        setRotation,
        setCurrentResult,
    ]);

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="background" className="text-base font-semibold">
                    輪盤底圖
                </Label>
                <Input
                    id="background"
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                />
                <div className="isolate flex -space-x-px">
                    <Button
                        onClick={() => handleResetImage(defaultWheelImagePath)}
                        variant="outline"
                        className="w-full rounded-r-none focus:z-10"
                    >
                        重設
                    </Button>
                    <Button
                        onClick={() => handleResetImage(null)}
                        variant="outline"
                        className="w-full rounded-l-none focus:z-10"
                    >
                        清除
                    </Button>
                </div>
            </div>

            <div className="space-y-2">
                <Label htmlFor="items" className="text-base font-semibold">
                    輪盤項目
                </Label>
                <Textarea
                    id="items"
                    value={itemsText}
                    onChange={handleItemsChange}
                    placeholder="輸入項目"
                    rows={5}
                    className="w-full"
                />
                <Button onClick={handleResetToDefaultItems} className="w-full">
                    重設
                </Button>
            </div>

            <Button
                onClick={handleSpin}
                disabled={isSpinning}
                className="w-full"
            >
                {isSpinning ? "抽獎中..." : "開始抽獎"}
            </Button>
        </>
    );
};

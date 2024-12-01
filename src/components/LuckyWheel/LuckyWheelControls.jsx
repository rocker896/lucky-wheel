import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCallback, useRef, useState } from "react";

export const LuckyWheelControls = ({
    rotation,
    wheelItems,
    visibleItems,
    wheelDiameter,
    defaultWheelItems,
    defaultWheelImagePath,
    setResults,
    setRotation,
    setWheelItems,
    setWheelImagePath,
    setVisibleItems,
    setCurrentResult,
}) => {
    const fileInputRef = useRef(null); // 新增 ref 來操作檔案輸入框
    const itemsBlockHeight = 218;
    const [itemsText, setItemsText] = useState(wheelItems.join("\n")); // 項目文本
    const [hiddenItems, setHiddenItems] = useState(new Set()); // 隱藏項目
    const [isEditingWheelItems, setIsEditingWheelItems] = useState(false); // 是否正在編輯輪盤項目
    const [isEditingHiddenItems, setIsEditingHiddenItems] = useState(false); // 是否正在編輯隱藏項目
    const [isSpinning, setIsSpinning] = useState(false); // 是否正在旋轉

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

    // 處理項目清空或重設
    const handleResetItems = (items) => {
        setItemsText(items.join("\n"));
        setWheelItems(items);
        setVisibleItems(items);
        setHiddenItems(new Set());
        setRotation(0); // 重置旋轉角度
    };

    // 處理項目更新
    const handleChangeItemsText = (e) => {
        const newItemsText = e.target.value;

        if (newItemsText === "") {
            handleResetItems([]);
        } else {
            setItemsText(newItemsText);

            const newItems = newItemsText
                .split("\n")
                .map((item) => item.trim())
                .filter((item) => item.length > 0);
            setWheelItems(newItems);

            const newVisibleItems = newItems.filter(
                (item) => !hiddenItems.has(item)
            );
            setVisibleItems(newVisibleItems);
        }
    };

    // 處理項目隱藏狀態切換
    const handleToggleHiddenItem = (item) => {
        const newHiddenItems = new Set(hiddenItems);
        if (newHiddenItems.has(item)) {
            newHiddenItems.delete(item);
        } else {
            newHiddenItems.add(item);
        }
        setHiddenItems(newHiddenItems);

        const newVisibleItems = wheelItems.filter(
            (item) => !newHiddenItems.has(item)
        );
        setVisibleItems(newVisibleItems);
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
                const segmentAngle = (2 * Math.PI) / visibleItems.length;
                const winningIndex =
                    visibleItems.length -
                    1 -
                    Math.floor(normalizedRotation / segmentAngle);
                const winner = visibleItems[winningIndex % visibleItems.length];

                const timestamp = new Date().toLocaleString();
                const newResult = { item: winner, time: timestamp };
                setResults((prev) => [...prev, newResult]);
                setCurrentResult(newResult);
            }
        };

        requestAnimationFrame(animate);
    }, [
        isSpinning,
        rotation,
        visibleItems,
        setResults,
        setRotation,
        setCurrentResult,
    ]);

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="wheelImage" className="text-base font-semibold">
                    輪盤底圖
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

            <div className="space-y-2">
                <Label htmlFor="wheelItems" className="text-base font-semibold">
                    輪盤項目
                </Label>

                {isEditingHiddenItems ? (
                    // 編輯隱藏項目模式
                    <div
                        className={`min-h-[${itemsBlockHeight}px] max-h-[${itemsBlockHeight}px] space-y-2 border rounded-md p-4`}
                        style={{
                            overflowY: "auto",
                        }}
                    >
                        {/* 不重複的輪盤項目 */}
                        {[...new Set(wheelItems)].map((item) => (
                            <div
                                key={item}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={item}
                                    checked={hiddenItems.has(item)}
                                    onCheckedChange={() =>
                                        handleToggleHiddenItem(item)
                                    }
                                />
                                <Label
                                    htmlFor={item}
                                    className="flex-grow cursor-pointer"
                                >
                                    {item}
                                </Label>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="space-y-2">
                        {isEditingWheelItems ? (
                            // 編輯輪盤項目模式
                            <Textarea
                                id="wheelItems"
                                value={itemsText}
                                onChange={handleChangeItemsText}
                                placeholder="輸入項目"
                                rows={10}
                                className="w-full"
                                autoFocus
                                onBlur={() => setIsEditingWheelItems(false)}
                            />
                        ) : (
                            <div
                                className={`min-h-[${itemsBlockHeight}px] max-h-[${itemsBlockHeight}px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`}
                                style={{
                                    cursor: "pointer",
                                    overflowY: "auto",
                                }}
                                onClick={() => setIsEditingWheelItems(true)}
                            >
                                {wheelItems.map((item, index) => (
                                    <div
                                        key={`${item}-${index}`}
                                        className={
                                            hiddenItems.has(item)
                                                ? "line-through text-muted-foreground bg-gray-300"
                                                : ""
                                        }
                                    >
                                        {item}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                <div className="isolate flex -space-x-px">
                    <Button
                        className="w-full rounded-r-none focus:z-10"
                        variant="outline"
                        onClick={() => handleResetItems([])}
                    >
                        清空
                    </Button>
                    <Button
                        className="w-full rounded-l-none rounded-r-none focus:z-10"
                        variant={isEditingHiddenItems ? "" : "outline"}
                        onClick={() =>
                            setIsEditingHiddenItems(!isEditingHiddenItems)
                        }
                    >
                        {isEditingHiddenItems ? "完成" : "隱藏"}
                    </Button>
                    <Button
                        className="w-full rounded-l-none focus:z-10"
                        variant="outline"
                        onClick={() => handleResetItems(defaultWheelItems)}
                    >
                        重設
                    </Button>
                </div>
            </div>

            <Button
                className="w-full"
                disabled={isSpinning || visibleItems.length < 1}
                onClick={handleSpin}
            >
                {isSpinning ? "抽獎中..." : "開始抽獎"}
            </Button>
        </>
    );
};

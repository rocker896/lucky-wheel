import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Cross2Icon } from "@radix-ui/react-icons";
import { useCallback, useState } from "react";

export const LuckyWheelPrizes = ({
    visibleItems,
    spinningRotation,
    setSpinningRotation,
    setCurrentResult,
    setSpinningResults,
}) => {
    // ↓ 是否正在旋轉
    const [isSpinning, setIsSpinning] = useState(false);
    // ↓ 環境變數: 獎項
    const envPrizes = process.env.NEXT_PUBLIC_PRIZES;
    // ↓ 預設獎項
    const defaultPrizes = envPrizes ? envPrizes.split(",") : [];
    // ↓ 獎項
    const [prizes, setPrizes] = useState(defaultPrizes);
    // ↓ 當前獎項
    const [currentPrize, setCurrentPrize] = useState(prizes[0]);

    // 處理抽獎
    const handleSpin = useCallback(() => {
        if (isSpinning) return;

        setIsSpinning(true);
        setCurrentResult(null);
        const spinDuration = 3000; // 旋轉持續時間
        const startRotation = spinningRotation; // 起始旋轉角度
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
                setSpinningRotation(
                    startRotation + (targetRotation - startRotation) * progress
                );
                requestAnimationFrame(animate);
            } else {
                setSpinningRotation(targetRotation);
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
                const newResult = {
                    item: winner,
                    time: timestamp,
                    prize: currentPrize,
                };
                setCurrentResult(newResult);
                setSpinningResults((prev) => [...prev, newResult]);
            }
        };

        requestAnimationFrame(animate);
    }, [
        isSpinning,
        currentPrize,
        visibleItems,
        spinningRotation,
        setSpinningRotation,
        setCurrentResult,
        setSpinningResults,
    ]);

    return (
        <div className="space-y-2">
            <Separator className="my-3" />
            <Label>獎項</Label>
            <div className="isolate flex flex-wrap gap-2">
                {prizes.map((item) => (
                    <Button
                        key={item}
                        variant={item === currentPrize ? "" : "outline"}
                        onClick={() => setCurrentPrize(item)}
                    >
                        {item}
                    </Button>
                ))}
                <div className="relative w-auto">
                    <Input
                        value={currentPrize}
                        placeholder="自訂獎項"
                        onChange={(e) => setCurrentPrize(e.target.value)}
                    />
                    <div
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
                        onClick={() => setCurrentPrize("")}
                    >
                        <Cross2Icon />
                    </div>
                </div>
            </div>
            <Button
                className="w-full"
                disabled={isSpinning || visibleItems.length < 1}
                onClick={handleSpin}
            >
                {isSpinning ? "抽獎中..." : "開始抽獎"}
            </Button>
        </div>
    );
};

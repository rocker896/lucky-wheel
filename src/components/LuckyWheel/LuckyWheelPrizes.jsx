import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useCallback, useState } from "react";

export const LuckyWheelPrizes = ({
    visibleItems,
    spinningRotation,
    setSpinningRotation,
    setSpinningResults,
    setCurrentResult,
}) => {
    const [isSpinning, setIsSpinning] = useState(false); // 是否正在旋轉

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
                const newResult = { item: winner, time: timestamp };
                setSpinningResults((prev) => [...prev, newResult]);
                setCurrentResult(newResult);
            }
        };

        requestAnimationFrame(animate);
    }, [
        visibleItems,
        spinningRotation,
        setSpinningRotation,
        setSpinningResults,
        setCurrentResult,
        isSpinning,
    ]);

    return (
        <>
            <div className="space-y-2">
                <Label htmlFor="wheelItems" className="text-base font-semibold">
                    獎項
                </Label>

                <Button
                    className="w-full"
                    disabled={isSpinning || visibleItems.length < 1}
                    onClick={handleSpin}
                >
                    {isSpinning ? "抽獎中..." : "開始抽獎"}
                </Button>
            </div>
        </>
    );
};

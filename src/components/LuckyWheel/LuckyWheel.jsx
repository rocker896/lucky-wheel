"use client";

import { LuckyWheelCanvas as Canvas } from "@/components/LuckyWheel/LuckyWheelCanvas";
import { LuckyWheelItems as Items } from "@/components/LuckyWheel/LuckyWheelItems";
import { LuckyWheelPrizes as Prizes } from "@/components/LuckyWheel/LuckyWheelPrizes";
import { LuckyWheelResultAlert as ResultAlert } from "@/components/LuckyWheel/LuckyWheelResultAlert";
import { LuckyWheelResults as Results } from "@/components/LuckyWheel/LuckyWheelResults";
import { ThemeToggleButton } from "@/components/Theme/ThemeToggleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export const LuckyWheel = () => {
    const envWheelItems = process.env.NEXT_PUBLIC_DEFAULT_WHEEL_ITEMS;
    // ↓ 預設輪盤項目
    const defaultWheelItems = envWheelItems
        ? envWheelItems.split(",")
        : ["1", "2", "3", "4", "5", "6"];
    // ↓ 輪盤項目
    const [wheelItems, setWheelItems] = useState(defaultWheelItems);
    // ↓ 可見項目
    const [visibleItems, setVisibleItems] = useState(wheelItems);
    // ↓ 旋轉角度
    const [spinningRotation, setSpinningRotation] = useState(0);
    // ↓ 抽獎結果
    const [spinningResults, setSpinningResults] = useState([]);
    // ↓ 當前結果
    const [currentResult, setCurrentResult] = useState(null);
    // ↓ 輪盤半徑
    const wheelRadius = 275;
    // ↓ 輪盤直徑
    const wheelDiameter = wheelRadius * 2;

    return (
        <div className="flex justify-center min-h-screen p-4">
            <Card className="w-full max-w-7xl">
                <CardHeader className="flex-row justify-between items-center py-3 border-b">
                    <CardTitle className="text-lg">幸運輪盤</CardTitle>
                    <ThemeToggleButton />
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* 左側區域 */}
                        <div className="flex-1 space-y-4">
                            <ResultAlert currentResult={currentResult} />
                            <Canvas
                                wheelItems={visibleItems}
                                wheelRadius={wheelRadius}
                                wheelDiameter={wheelDiameter}
                                spinningRotation={spinningRotation}
                            />
                        </div>

                        {/* 右側區域 */}
                        <div className="flex-1 space-y-4">
                            <Items
                                wheelItems={wheelItems}
                                defaultWheelItems={defaultWheelItems}
                                setWheelItems={setWheelItems}
                                setVisibleItems={setVisibleItems}
                            />
                            <Prizes
                                visibleItems={visibleItems}
                                spinningRotation={spinningRotation}
                                setSpinningRotation={setSpinningRotation}
                                setSpinningResults={setSpinningResults}
                                setCurrentResult={setCurrentResult}
                            />
                            <Results spinningResults={spinningResults} />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

"use client";

import { LuckyWheelCanvas } from "@/components/LuckyWheel/LuckyWheelCanvas";
import { LuckyWheelControls } from "@/components/LuckyWheel/LuckyWheelControls";
import { LuckyWheelResultAlert } from "@/components/LuckyWheel/LuckyWheelResultAlert";
import { LuckyWheelResults } from "@/components/LuckyWheel/LuckyWheelResults";
import { ThemeToggleButton } from "@/components/Theme/ThemeToggleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export const LuckyWheel = () => {
    // 狀態管理
    const [items, setItems] = useState(["1", "2", "3", "4", "5", "6"]); // 輪盤預設項目
    const [rotation, setRotation] = useState(0); // 當前旋轉角度
    const [wheelImage, setWheelImage] = useState(""); // 輪盤底圖
    const [results, setResults] = useState([]); // 抽獎結果
    const [currentResult, setCurrentResult] = useState(null); // 當前結果
    const wheelRadius = 275; // 輪盤半徑
    const wheelDiameter = wheelRadius * 2; // 輪盤直徑

    return (
        <div className="flex flex-col space-y-4 p-4">
            <Card className="w-full max-w-2xl mx-auto">
                <CardHeader className="flex-row justify-between items-center py-3">
                    <CardTitle className="text-lg">幸運輪盤</CardTitle>
                    <ThemeToggleButton />
                </CardHeader>

                <CardContent className="space-y-4">
                    <LuckyWheelResultAlert currentResult={currentResult} />

                    <LuckyWheelCanvas
                        items={items}
                        rotation={rotation}
                        wheelImage={wheelImage}
                        wheelRadius={wheelRadius}
                        wheelDiameter={wheelDiameter}
                    />

                    <LuckyWheelControls
                        items={items}
                        rotation={rotation}
                        wheelDiameter={wheelDiameter}
                        setItems={setItems}
                        setResults={setResults}
                        setRotation={setRotation}
                        setWheelImage={setWheelImage}
                        setCurrentResult={setCurrentResult}
                    />

                    <LuckyWheelResults results={results} />
                </CardContent>
            </Card>
        </div>
    );
};

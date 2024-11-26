"use client";

import { LuckyWheelCanvas } from "@/components/LuckyWheel/LuckyWheelCanvas";
import { LuckyWheelControls } from "@/components/LuckyWheel/LuckyWheelControls";
import { LuckyWheelResultAlert } from "@/components/LuckyWheel/LuckyWheelResultAlert";
import { LuckyWheelResults } from "@/components/LuckyWheel/LuckyWheelResults";
import { ThemeToggleButton } from "@/components/Theme/ThemeToggleButton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";

export const LuckyWheel = () => {
    const envWheelItems = process.env.NEXT_PUBLIC_DEFAULT_WHEEL_ITEMS;
    const defaultWheelItems = envWheelItems
        ? envWheelItems.split(",")
        : ["1", "2", "3", "4", "5", "6"]; // 預設輪盤項目
    const [wheelItems, setWheelItems] = useState(defaultWheelItems);

    const envWheelImagePath = process.env.NEXT_PUBLIC_DEFAULT_WHEEL_IMAGE_PATH;
    const defaultWheelImagePath = envWheelImagePath ? envWheelImagePath : ""; // 預設輪盤底圖路徑
    const [wheelImagePath, setWheelImagePath] = useState(defaultWheelImagePath);

    const [rotation, setRotation] = useState(0); // 當前旋轉角度
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
                        rotation={rotation}
                        wheelItems={wheelItems}
                        wheelImagePath={wheelImagePath}
                        wheelRadius={wheelRadius}
                        wheelDiameter={wheelDiameter}
                    />

                    <LuckyWheelControls
                        rotation={rotation}
                        wheelItems={wheelItems}
                        wheelDiameter={wheelDiameter}
                        defaultWheelItems={defaultWheelItems}
                        defaultWheelImagePath={defaultWheelImagePath}
                        setResults={setResults}
                        setRotation={setRotation}
                        setWheelItems={setWheelItems}
                        setWheelImagePath={setWheelImagePath}
                        setCurrentResult={setCurrentResult}
                    />

                    <LuckyWheelResults results={results} />
                </CardContent>
            </Card>
        </div>
    );
};

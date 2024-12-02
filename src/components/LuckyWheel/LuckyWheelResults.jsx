import { Alert, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Check, Copy } from "lucide-react";
import { useEffect, useRef, useState } from "react";

export const LuckyWheelResults = ({ spinningResults }) => {
    // ↓ 通知訊息
    const [notification, setNotification] = useState(null);
    // ↓ 通知計時器引用
    const notificationTimeoutRef = useRef(null);

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
        const textToCopy = spinningResults
            .map((result) => `${result.time}: ${result.item}`)
            .join("\n");
        navigator.clipboard.writeText(textToCopy).then(() => {
            showNotification("已複製所有結果到剪貼簿");
        });
    };

    return (
        <div className="space-y-2">
            {notification && (
                <Alert className="fixed top-4 right-4 z-50 bg-green-100 border-green-400 w-auto">
                    <AlertTitle className="text-green-800 flex items-center gap-2">
                        <Check className="h-4 w-4" />
                        {notification}
                    </AlertTitle>
                </Alert>
            )}
            <Separator className="my-3" />
            <div className="flex justify-between items-center mb-2">
                <Label className="text-base font-semibold">抽獎記錄</Label>
                {spinningResults.length > 0 && (
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
                {spinningResults.map((result, index) => (
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
    );
};

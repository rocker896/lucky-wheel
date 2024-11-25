import { Alert, AlertTitle } from "@/components/ui/alert";

export const LuckyWheelResultAlert = ({ currentResult }) => {
    return (
        <>
            {currentResult && (
                <Alert className="bg-yellow-100 border-yellow-400">
                    <AlertTitle className="text-xl font-bold text-center">
                        🎉 得獎項目：{currentResult.item} 🎉
                    </AlertTitle>
                </Alert>
            )}
        </>
    );
};

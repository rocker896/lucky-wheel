import { Alert, AlertTitle } from "@/components/ui/alert";
import { RocketIcon, SketchLogoIcon } from "@radix-ui/react-icons";

export const LuckyWheelResultAlert = ({ currentResult }) => {
    return (
        <>
            {currentResult ? (
                <Alert className="bg-yellow-400 py-2">
                    <AlertTitle className="flex items-center justify-center text-2xl font-normal text-black">
                        <RocketIcon className="h-6 w-6 mx-1" />
                        恭喜
                        {currentResult.prize ? (
                            <>
                                <span className="font-semibold mx-1">
                                    {currentResult.item}
                                </span>
                                抽中
                                <span className="font-semibold ml-1">
                                    {currentResult.prize}
                                </span>
                            </>
                        ) : (
                            <>
                                <span className="font-semibold ml-1">
                                    {currentResult.item}
                                </span>
                            </>
                        )}
                        <RocketIcon className="h-6 w-6 mx-1" />
                    </AlertTitle>
                </Alert>
            ) : (
                <Alert className="bg-amber-200 py-2">
                    <AlertTitle className="flex items-center justify-center text-2xl font-semibold text-black">
                        <SketchLogoIcon className="h-6 w-6 mx-1" />
                        <span>掛台換現金 荷包不傷心</span>
                        <SketchLogoIcon className="h-6 w-6 mx-1" />
                    </AlertTitle>
                </Alert>
            )}
        </>
    );
};

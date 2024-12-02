import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

export const LuckyWheelItems = ({
    wheelItems,
    defaultWheelItems,
    setWheelItems,
    setVisibleItems,
}) => {
    // ↓ 項目文本
    const [itemsText, setItemsText] = useState(wheelItems.join("\n"));
    // ↓ 隱藏項目
    const [hiddenItems, setHiddenItems] = useState(new Set());
    // ↓ 是否正在編輯輪盤項目
    const [isEditingWheelItems, setIsEditingWheelItems] = useState(false);
    // ↓ 是否正在編輯隱藏項目
    const [isEditingHiddenItems, setIsEditingHiddenItems] = useState(false);

    // 處理項目清空或重設
    const handleResetItems = (items) => {
        setItemsText(items.join("\n"));
        setWheelItems(items);
        setVisibleItems(items);
        setHiddenItems(new Set());
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

    return (
        <div className="space-y-2">
            <Label htmlFor="wheelItems">項目</Label>
            {isEditingHiddenItems ? (
                // 編輯隱藏項目模式
                <div
                    className={`min-h-[218px] max-h-[218px] space-y-2 border rounded-md p-4`}
                    style={{
                        overflowY: "auto",
                    }}
                >
                    {/* 不重複的輪盤項目 */}
                    {[...new Set(wheelItems)].map((item) => (
                        <div key={item} className="flex items-center space-x-2">
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
                <>
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
                            className={`min-h-[218px] max-h-[218px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background`}
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
                </>
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
    );
};

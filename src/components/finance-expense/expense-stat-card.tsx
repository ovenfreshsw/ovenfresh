import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExpenseStatCard = ({
    title,
    total,
    items,
}: {
    title: string;
    total: number;
    items: number;
}) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">${total || 0}</div>
                <p className="text-xs text-muted-foreground mt-1">
                    {items} items purchased
                </p>
            </CardContent>
        </Card>
    );
};

export default ExpenseStatCard;

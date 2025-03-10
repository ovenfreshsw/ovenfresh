import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const RevenueStatCard = ({
    title,
    data,
}: {
    title: string;
    data?: {
        total: number;
        tiffin: number;
        catering: number;
    } | null;
}) => {
    return (
        <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
                <div className="text-2xl font-bold">${data?.total || 0}</div>
                <Separator />
                <div className="flex gap-2 items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <span className="text-xs">Tiffin</span>
                        <span className="font-semibold text-xs">
                            ${data?.tiffin || 0}
                        </span>
                    </div>
                    <div className="h-10 w-px bg-muted-foreground/30"></div>
                    <div className="flex flex-col gap-1">
                        <span className="text-xs">Catering</span>
                        <span className="font-semibold text-xs">
                            ${data?.catering || 0}
                        </span>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default RevenueStatCard;

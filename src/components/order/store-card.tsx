import { Store } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { CateringDocumentPopulate } from "@/models/types/catering";

const StoreCard = ({ store }: { store: CateringDocumentPopulate["store"] }) => {
    return (
        <Card className="h-fit">
            <CardHeader className="flex flex-row items-center space-y-0">
                <CardTitle className="flex items-center gap-2">
                    <Store className="h-5 w-5" />
                    Store Details
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid gap-2">
                    <div>
                        <div className="font-semibold">{store.name}</div>
                        <div className="text-sm text-muted-foreground">
                            ID: {store._id}
                        </div>
                    </div>
                    <div className="text-sm">{store.address}</div>
                </div>
            </CardContent>
        </Card>
    );
};

export default StoreCard;

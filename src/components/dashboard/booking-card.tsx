import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import Link from "next/link";

const BookingCard = () => {
    return (
        <Card className="h-full shadow-sm bg-primary-foreground">
            <CardHeader className="p-5">
                <CardTitle className="font-medium text-sm">Booking</CardTitle>
            </CardHeader>
            <CardContent className="pt-2 flex-col flex gap-4">
                <Button className="w-full" asChild>
                    <Link href="/dashboard/booking">Catering</Link>
                </Button>
                <Button className="w-full">
                    <Link href="/dashboard/booking">Tiffin</Link>
                </Button>
            </CardContent>
        </Card>
    );
};

export default BookingCard;

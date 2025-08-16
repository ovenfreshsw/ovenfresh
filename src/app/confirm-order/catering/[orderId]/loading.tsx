import { Loader2 } from "lucide-react";

const Loading = () => {
    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <div className="flex gap-1 items-center">
                <Loader2 className="animate-spin" />
                <span>Loading...</span>
            </div>
        </div>
    );
};

export default Loading;

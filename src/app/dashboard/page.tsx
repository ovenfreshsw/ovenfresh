import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { NumberTicker } from "@/components/ui/number-ticker";
import Upload from "@/components/upload/upload";
import { CloudinaryUploadWidgetInfo } from "next-cloudinary";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "@/components/data-table/columns";
import path from "path";
import fs from "fs";
import { RevenueGraph } from "@/components/graphs/revenue-graph";

async function getData() {
    const filePath = path.join(
        process.cwd(),
        "src/components/data-table",
        "data.json"
    );
    const data = fs.readFileSync(filePath, "utf8");
    return JSON.parse(data);
}

const Home = async () => {
    // const [resource, setResource] = useState<
    //     CloudinaryUploadWidgetInfo & { url: string }
    // >();

    const data = await getData();

    return (
        // <div>
        //     Home
        //     <Upload setResource={setResource} folder="catering_menu" />
        //     {resource?.url && (
        //         <Image src={resource.url} alt="Test" width={100} height={100} />
        //     )}
        // </div>
        <div className="md:px-3 py-5">
            <div className="flex justify-between items-center">
                <span className="font-medium">Overview</span>
                <div className="space-y-2">
                    <Select defaultValue="1">
                        {/* Adjust the min-width to fit the longest option */}
                        <SelectTrigger className="w-auto min-w-48 max-w-full">
                            <SelectValue placeholder="Select framework" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="1">Last week</SelectItem>
                            <SelectItem value="2">Last two week</SelectItem>
                            <SelectItem value="3">Last Month</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mt-7">
                <div className="border rounded-lg p-6 space-y-4 shadow">
                    <span className="font-medium block">Total revenue</span>
                    <span className="text-2xl font-semibold block">
                        $
                        <NumberTicker
                            value={2.6}
                            decimalPlaces={1}
                            direction="up"
                        />
                        M
                    </span>
                    <div className="text-xs">
                        <span className="bg-green-500/20 rounded-md px-1.5 py-1">
                            +4.5%
                        </span>
                        &nbsp;
                        <span>from last week</span>
                    </div>
                </div>
                <div className="border rounded-lg p-6 space-y-4 shadow">
                    <span className="font-medium block">
                        Average order value
                    </span>
                    <span className="text-2xl font-semibold block">
                        $<NumberTicker value={455} direction="up" />
                    </span>
                    <div className="text-xs">
                        <span className="bg-red-500/20 rounded-md px-1.5 py-1">
                            -0.5%
                        </span>
                        &nbsp;
                        <span>from last week</span>
                    </div>
                </div>
                <div className="border rounded-lg p-6 space-y-4 shadow">
                    <span className="font-medium block">Total rentals</span>
                    <span className="text-2xl font-semibold block">
                        <NumberTicker value={257} direction="up" />
                    </span>
                    <div className="text-xs">
                        <span className="bg-green-500/20 rounded-md px-1.5 py-1">
                            +0.5%
                        </span>
                        &nbsp;
                        <span>from last week</span>
                    </div>
                </div>
                <div className="border rounded-lg p-6 space-y-4 shadow">
                    <span className="font-medium block">Total customers</span>
                    <span className="text-2xl font-semibold block">
                        <NumberTicker value={1256} direction="up" />
                    </span>
                    <div className="text-xs">
                        <span className="bg-green-500/20 rounded-md px-1.5 py-1">
                            +0.1%
                        </span>
                        &nbsp;
                        <span>from last week</span>
                    </div>
                </div>
            </div>
            <div className="py-10 space-y-7">
                <div className="border rounded-lg space-y-7 p-6 shadow">
                    <span className="font-medium">Recent orders</span>
                    <DataTable data={data} columns={columns} />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <RevenueGraph />
                </div>
            </div>
        </div>
    );
};

export default Home;

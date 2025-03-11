import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "../ui/select";

const RoleSelect = ({ defaultValue }: { defaultValue?: string }) => {
    return (
        <Select name="role" defaultValue={defaultValue}>
            <SelectTrigger className="col-span-3 text-primary">
                <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent className="z-[1560]">
                <SelectItem value="MANAGER">MANAGER</SelectItem>
                <SelectItem value="DELIVERY">DELIVERY</SelectItem>
            </SelectContent>
        </Select>
    );
};

export default RoleSelect;

import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import Link from "next/link";
import { usePathname } from "next/navigation";
import LockClockIcon from "@mui/icons-material/LockClock";
import PeopleIcon from "@mui/icons-material/People";
import StoreIcon from "@mui/icons-material/Store";
import LocalGroceryStoreIcon from "@mui/icons-material/LocalGroceryStore";
import { useSession } from "next-auth/react";
import PaidIcon from "@mui/icons-material/Paid";
import MenuBookIcon from "@mui/icons-material/MenuBook";

const mainListItems = [
    {
        text: "Dashboard",
        icon: <HomeRoundedIcon />,
        href: "/dashboard",
    },
    {
        text: "Booking",
        icon: <EditNoteRoundedIcon />,
        href: "/dashboard/booking",
    },
    {
        text: "Orders",
        icon: <LocalMallRoundedIcon />,
        href: "/dashboard/orders",
    },
    {
        text: "Scheduled Orders",
        icon: <LockClockIcon />,
        href: "/dashboard/scheduled",
    },
    {
        text: "Staffs",
        icon: <PeopleIcon />,
        href: "/dashboard/staffs",
    },
    {
        text: "Stores",
        icon: <StoreIcon />,
        href: "/dashboard/stores",
    },
    {
        text: "Finance & Expenses",
        icon: <PaidIcon />,
        href: "/dashboard/finance-expenses",
    },
    {
        text: "Groceries",
        icon: <LocalGroceryStoreIcon />,
        href: "/dashboard/groceries",
    },
    {
        text: "Menus",
        icon: <MenuBookIcon />,
        href: "/dashboard/menus",
    },
];

// List of items that should be visible only to admins
const adminOnlyItems = ["Staffs", "Stores", "Finance & Expenses"];

export default function MenuContent() {
    const [selected, setSelected] = React.useState(0);
    const pathname = usePathname();
    const session = useSession();
    const role = session.data?.user.role;

    // Filter based on user role
    const filteredListItems =
        role === "SUPERADMIN"
            ? mainListItems // Include all items if the user is an admin
            : mainListItems.filter(
                  (item) => !adminOnlyItems.includes(item.text)
              ); // Remove admin-only items for non-admin users

    React.useEffect(() => {
        setSelected(mainListItems.findIndex((item) => item.href === pathname));
    }, [pathname]);

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
            <List dense>
                {filteredListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <Link href={item.href}>
                            <ListItemButton selected={index === selected}>
                                <ListItemIcon className="!min-w-fit mr-3 [&>svg]:text-primary">
                                    {item.icon}
                                </ListItemIcon>
                                <ListItemText
                                    className="[&>span]:text-[15px]"
                                    primary={item.text}
                                />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

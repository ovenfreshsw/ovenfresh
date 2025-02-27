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

const mainListItems = [
    { text: "Dashboard", icon: <HomeRoundedIcon />, href: "/dashboard" },
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
];

export default function MenuContent() {
    const [selected, setSelected] = React.useState(0);
    const pathname = usePathname();

    React.useEffect(() => {
        setSelected(mainListItems.findIndex((item) => item.href === pathname));
    }, [pathname]);

    return (
        <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
            <List dense>
                {mainListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <Link href={item.href}>
                            <ListItemButton selected={index === selected}>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <ListItemText primary={item.text} />
                            </ListItemButton>
                        </Link>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

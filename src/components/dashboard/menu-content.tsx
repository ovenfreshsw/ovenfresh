import * as React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import SettingsRoundedIcon from "@mui/icons-material/SettingsRounded";
import InfoRoundedIcon from "@mui/icons-material/InfoRounded";
import HelpRoundedIcon from "@mui/icons-material/HelpRounded";
import EditNoteRoundedIcon from "@mui/icons-material/EditNoteRounded";
import LocalMallRoundedIcon from "@mui/icons-material/LocalMallRounded";
import Link from "next/link";
import { usePathname } from "next/navigation";

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
        text: "Clients",
        icon: <PeopleRoundedIcon />,
        href: "/dashboard/clients",
    },
    {
        text: "Tasks",
        icon: <AssignmentRoundedIcon />,
        href: "/dashboard/tasks",
    },
];

const secondaryListItems = [
    { text: "Settings", icon: <SettingsRoundedIcon /> },
    { text: "About", icon: <InfoRoundedIcon /> },
    { text: "Feedback", icon: <HelpRoundedIcon /> },
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
            <List dense>
                {secondaryListItems.map((item, index) => (
                    <ListItem
                        key={index}
                        disablePadding
                        sx={{ display: "block" }}
                    >
                        <ListItemButton>
                            <ListItemIcon>{item.icon}</ListItemIcon>
                            <ListItemText primary={item.text} />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Stack>
    );
}

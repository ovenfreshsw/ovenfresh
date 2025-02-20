"use client";

import * as React from "react";
import MuiAvatar from "@mui/material/Avatar";
import MuiListItemAvatar from "@mui/material/ListItemAvatar";
import MenuItem from "@mui/material/MenuItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListSubheader from "@mui/material/ListSubheader";
import Select, { SelectChangeEvent, selectClasses } from "@mui/material/Select";
import Divider from "@mui/material/Divider";
import { styled } from "@mui/material/styles";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import Image from "next/image";

const Avatar = styled(MuiAvatar)(({ theme }) => ({
    width: 28,
    height: 28,
    backgroundColor: (theme.vars || theme).palette.background.paper,
    color: (theme.vars || theme).palette.text.secondary,
    border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
    minWidth: 0,
    marginRight: 12,
});

export default function SelectContent() {
    const [company, setCompany] = React.useState("");

    const handleChange = (event: SelectChangeEvent) => {
        setCompany(event.target.value as string);
    };

    return (
        <Select
            labelId="company-select"
            id="company-simple-select"
            value={company}
            onChange={handleChange}
            displayEmpty
            inputProps={{ "aria-label": "Select company" }}
            fullWidth
            sx={{
                maxHeight: 56,
                width: 215,
                "&.MuiList-root": {
                    p: "8px",
                },
                [`& .${selectClasses.select}`]: {
                    display: "flex",
                    alignItems: "center",
                    gap: "2px",
                    pl: 1,
                },
            }}
        >
            <ListSubheader sx={{ pt: 0 }}>Stores</ListSubheader>
            <MenuItem value="">
                <ListItemAvatar>
                    <Avatar
                        alt="The oven fresh scarborough"
                        className="relative"
                    >
                        <Image src="/logo.webp" alt="logo" fill />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText
                    primary="The Oven Fresh"
                    secondary="Scarborough"
                />
            </MenuItem>
            <MenuItem value={10}>
                <ListItemAvatar>
                    <Avatar alt="The oven fresh oshawa" className="relative">
                        <Image src="/logo.webp" alt="logo" fill />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText primary="The Oven Fresh" secondary="Oshawa" />
            </MenuItem>
            <Divider sx={{ mx: -1 }} />
            <MenuItem value={40}>
                <ListItemIcon>
                    <AddRoundedIcon />
                </ListItemIcon>
                <ListItemText primary="Add store" secondary="new store" />
            </MenuItem>
        </Select>
    );
}

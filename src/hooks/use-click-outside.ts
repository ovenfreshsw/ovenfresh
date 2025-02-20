"use client";

import React from "react";
import { useEventListener } from "./use-event-listener";

export function useClickOutside(
    ref: React.RefObject<HTMLDivElement | null>,
    handler: (e: Event) => void,
    event = "mousedown"
) {
    useEventListener(event, (event) => {
        const el = ref?.current;

        if (!el || el.contains(event.target as Node)) {
            return;
        }

        handler(event);
    });
}

"use client";

import * as React from "react";

import { useMediaQuery } from "@/hooks/use-media-query";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTrigger,
} from "@/components/ui/drawer";
import TiffinDialogContent from "./tiffin-dialog-content";
import LoadingButton from "@/components/ui/loading-button";
import Whatsapp from "@/components/icons/whatsapp";
import { UseFormReturn } from "react-hook-form";
import { z } from "zod";
import { ZodTiffinSchema } from "@/lib/zod-schema/schema";
import { TiffinMenuDocument } from "@/models/types/tiffin-menu";
import { calculateTotalAmount } from "@/lib/utils";
import { UseMutationResult } from "@tanstack/react-query";

export function TiffinConfirmDrawer({
    mutation,
    form,
    open,
    setOpen,
    tiffinMenu,
}: {
    mutation: UseMutationResult<unknown, unknown, unknown, unknown>;
    form: UseFormReturn<z.infer<typeof ZodTiffinSchema>>;
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
    tiffinMenu?: TiffinMenuDocument | null;
}) {
    const [advanceAmount, setAdvanceAmount] = React.useState("");
    const [pendingAmount, setPendingAmount] = React.useState(0);
    const [note, setNote] = React.useState("");
    const isDesktop = useMediaQuery("(min-width: 768px)");

    const number_of_weeks = form.getValues("number_of_weeks");
    const order_type = form.getValues("order_type");

    React.useEffect(() => {
        const { tax, total } = calculateTotalAmount(form, tiffinMenu);

        form.setValue("totalAmount", total.toString());
        form.setValue("tax", tax);
    }, [form, tiffinMenu, number_of_weeks, order_type, open]);

    const handleAdvanceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if (
            value === "" ||
            (Number.parseFloat(value) > 0 &&
                Number.parseFloat(value) <=
                    Number(form.getValues("totalAmount")))
        ) {
            setAdvanceAmount(value);
        }
    };

    if (isDesktop) {
        return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button disabled={!form.formState.isValid}>Submit</Button>
                </DialogTrigger>
                <DialogContent className="flex flex-col max-w-xl z-[1550] max-h-[90%]">
                    <DialogHeader>
                        <DialogTitle className="text-2xl font-medium">
                            Order Confirmation Summary
                        </DialogTitle>
                        <DialogDescription>
                            Confirm your order details below with advance
                            amount.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="p-4 overflow-y-scroll flex-1 scrollbar-thin pt-0">
                        <TiffinDialogContent
                            form={form}
                            advanceAmount={advanceAmount}
                            note={note}
                            setNote={setNote}
                            handleAdvanceChange={handleAdvanceChange}
                            pendingAmount={pendingAmount}
                            setPendingAmount={setPendingAmount}
                        />
                    </div>
                    <DialogFooter className="flex sm:justify-between items-center w-full">
                        <Button
                            variant="outline"
                            className="border-green-200 text-green-500 hover:bg-green-100 hover:text-green-500 flex items-center gap-2"
                            disabled
                        >
                            <Whatsapp />
                            Send to customer for confirmation
                        </Button>
                        <div className="flex items-center gap-2">
                            <DialogClose asChild>
                                <Button
                                    variant="ghost"
                                    className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                                >
                                    Cancel
                                </Button>
                            </DialogClose>
                            <LoadingButton
                                // disabled={
                                //     advanceAmount === "" ||
                                //     !form.formState.isValid ||
                                //     mutation.isPending
                                // }
                                isLoading={mutation.isPending}
                                type="submit"
                                form="tiffin-form"
                                onClick={() => {
                                    form.setValue("advancePaid", advanceAmount);
                                    form.setValue(
                                        "pendingAmount",
                                        pendingAmount.toString()
                                    );
                                    form.setValue("note", note);
                                }}
                            >
                                Confirm order
                            </LoadingButton>
                        </div>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        );
    }

    return (
        <Drawer open={open} onOpenChange={setOpen}>
            <DrawerTrigger asChild>
                <Button disabled={!form.formState.isValid}>Submit</Button>
            </DrawerTrigger>
            <DrawerContent className="z-[1550] max-h-[90%]">
                <DrawerHeader className="text-left">
                    <DialogTitle>Order Confirmation Summary</DialogTitle>
                    <DrawerDescription>
                        Confirm your order details below with advance amount.
                    </DrawerDescription>
                </DrawerHeader>
                <div className="p-4 flex-1 overflow-y-scroll scrollbar-thin pt-0">
                    <TiffinDialogContent
                        form={form}
                        advanceAmount={advanceAmount}
                        handleAdvanceChange={handleAdvanceChange}
                        note={note}
                        setNote={setNote}
                        pendingAmount={pendingAmount}
                        setPendingAmount={setPendingAmount}
                    />
                </div>
                <DrawerFooter className="pt-2">
                    <DrawerClose asChild>
                        <Button
                            variant="ghost"
                            className="bg-destructive/10 text-destructive hover:bg-destructive/30 hover:text-destructive"
                        >
                            Cancel
                        </Button>
                    </DrawerClose>
                    <LoadingButton
                        disabled={
                            advanceAmount === "" ||
                            !form.formState.isValid ||
                            mutation.isPending
                        }
                        isLoading={mutation.isPending}
                        type="submit"
                        form="tiffin-form"
                        onClick={() => {
                            form.setValue("advancePaid", advanceAmount);
                            form.setValue(
                                "pendingAmount",
                                pendingAmount.toString()
                            );
                        }}
                    >
                        Confirm order
                    </LoadingButton>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}

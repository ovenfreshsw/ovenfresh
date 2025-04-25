"use client";

import * as React from "react";
import Box from "@mui/material/Box";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import Typography from "@mui/material/Typography";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SelectItems from "./select-items";
import CateringForm from "../forms/catering-form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { ZodCateringSchema } from "@/lib/zod-schema/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import FinalSummary from "./final-summary/final-summary";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { RootState } from "@/store";
import { QueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useCreateCateringOrder } from "@/api-hooks/catering/create-order";
import { clearState } from "@/store/slices/cateringItemSlice";
import { clearState as clearOrderState } from "@/store/slices/cateringOrderSlice";
import LoadingButton from "../ui/loading-button";
import { useCateringMenu } from "@/api-hooks/catering/get-catering-menu";

const steps = ["Select Items", "Enter address", "Order summery"];

export default function CateringFormStepper() {
    const form = useForm<z.infer<typeof ZodCateringSchema>>({
        resolver: zodResolver(ZodCateringSchema),
        defaultValues: {
            deliveryDate: new Date(
                new Date().setDate(new Date().getDate() + 1)
            ),
            payment_method: "cash",
            note: "",
            customerDetails: {
                firstName: "",
                lastName: "",
                phone: "",
                address: "",
                aptSuiteUnit: "",
            },
        },
    });

    const [activeStep, setActiveStep] = React.useState(0);
    const order = useSelector((state: RootState) => state.cateringOrder);
    const orderItems = useSelector((state: RootState) => state.cateringItem);

    const dispatch = useDispatch();

    function onSuccess(queryClient: QueryClient) {
        queryClient.invalidateQueries({ queryKey: ["order", "catering"] });
        toast.success("Order created successfully!");
        setActiveStep(0);
        resetForm();
    }

    // React queries
    const mutation = useCreateCateringOrder(onSuccess);
    const { data: menu, isPending } = useCateringMenu("false");

    const handleNext = () => {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
    };

    const handleBack = () => {
        setActiveStep((prevActiveStep) => prevActiveStep - 1);
    };

    const handleReset = () => {
        setActiveStep(0);
    };

    const handleSubmit = () => {
        const data = {
            ...order,
            customerDetails: {
                ...order.customerDetails,
                address: order.customerDetails.address.address,
                lat: Number(order.customerDetails.lat || 0),
                lng: Number(order.customerDetails.lng || 0),
                aptSuiteUnit: order.customerDetails.aptSuiteUnit,
            },
            items: orderItems.map((item) => ({
                itemId: item._id,
                quantity: item.quantity,
                priceAtOrder: item.priceAtOrder,
                size: item.size,
            })),
        };
        const result = ZodCateringSchema.safeParse(data);

        console.log(data);

        if (result.success) {
            mutation.mutate({
                ...data,
                deliveryDate: new Date(data.deliveryDate),
            });
        }
        if (result.error) {
            toast.error("Please fill all the form fields!");
        }
    };

    function resetForm() {
        form.reset();
        dispatch(clearState());
        dispatch(clearOrderState());
    }

    return (
        <Box sx={{ width: "100%" }}>
            <Stepper
                activeStep={activeStep}
                className="[svg_text]:text-red-500"
            >
                {steps.map((label) => {
                    const stepProps: { completed?: boolean } = {};
                    return (
                        <Step key={label} {...stepProps}>
                            <StepLabel
                                classes={{
                                    iconContainer: "[&svg>text]:text-red-500",
                                }}
                            >
                                {label}
                            </StepLabel>
                        </Step>
                    );
                })}
            </Stepper>
            <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    className="mr-1"
                    variant="outline"
                    size={"sm"}
                    type="button"
                >
                    <ChevronLeft className="size-4" />
                    Back
                </Button>
                <Box sx={{ flex: "1 1 auto" }} />
                {activeStep >= steps.length - 1 ? (
                    <LoadingButton
                        disabled={isPending || menu?.length === 0}
                        isLoading={mutation.isPending}
                        onClick={handleSubmit}
                        size={"sm"}
                    >
                        Confirm order
                    </LoadingButton>
                ) : (
                    <Button
                        onClick={handleNext}
                        size={"sm"}
                        disabled={isPending || menu?.length === 0}
                        type="button"
                    >
                        Next <ChevronRight className="size-4" />
                    </Button>
                )}
            </Box>
            {activeStep === steps.length ? (
                <React.Fragment>
                    <Typography sx={{ mt: 2, mb: 1 }}>
                        All steps completed - you&apos;re finished
                    </Typography>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "row",
                            pt: 2,
                        }}
                    >
                        <Box sx={{ flex: "1 1 auto" }} />
                        <Button type="button" onClick={handleReset}>
                            Reset
                        </Button>
                    </Box>
                </React.Fragment>
            ) : (
                <React.Fragment>
                    {activeStep === 0 && (
                        <Box sx={{ mt: 2, mb: 1 }}>
                            <SelectItems isPending={isPending} data={menu} />
                        </Box>
                    )}
                    {activeStep === 1 && (
                        <Box sx={{ mt: 2, mb: 1 }}>
                            <CateringForm form={form} />
                        </Box>
                    )}
                    {activeStep === 2 && (
                        <Box sx={{ mt: 2, mb: 1 }}>
                            <FinalSummary form={form} />
                        </Box>
                    )}
                </React.Fragment>
            )}
        </Box>
    );
}

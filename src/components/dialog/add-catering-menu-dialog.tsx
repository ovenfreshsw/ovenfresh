// import {
//     Dialog,
//     DialogContent,
//     DialogFooter,
//     DialogHeader,
//     DialogTitle,
//     DialogTrigger,
// } from "@/components/ui/dialog";
// import { Button } from "../ui/button";
// import { Plus } from "lucide-react";
// import { Label } from "../ui/label";
// import { Input } from "../ui/input";
// import { Textarea } from "../ui/textarea";
// import { Switch } from "@mui/material";
// import LoadingButton from "../ui/loading-button";
// import { useState } from "react";
// import { ZodCateringMenuSchema } from "@/lib/zod-schema/schema";
// import { toast } from "sonner";

// const AddCateringMenuDialog = () => {
//     const [open, setOpen] = useState(false);
//     const [loading, setLoading] = useState(false);

//     function handleSubmit(formData: FormData) {
//         setLoading(true);

//         const data = Object.fromEntries(formData);
//         const result = ZodCateringMenuSchema.safeParse(data);
//         if (!result.success) {
//             toast.error("Invalid data format.");
//             setLoading(false);
//             return;
//         }

//         const promise = () =>
//             new Promise(async (resolve, reject) => {
//                 const result = await addStaffAction(formData);
//                 setLoading(false);
//                 if (result.success) resolve(result);
//                 else reject(result);
//             });

//         toast.promise(promise, {
//             loading: "Creating staff...",
//             success: () => "Staff created successfully.",
//             error: ({ error }) => (error ? error : "Failed to create staff."),
//         });
//     }
//     return (
//         <Dialog open={open} onOpenChange={setOpen}>
//             <DialogTrigger asChild>
//                 <Button
//                     size={"sm"}
//                     className="flex items-center gap-2"
//                     onClick={() => setOpen(true)}
//                 >
//                     <Plus />
//                     Add catering menu
//                 </Button>
//             </DialogTrigger>
//             <DialogContent>
//                 <DialogHeader>
//                     <DialogTitle>Add new menu item</DialogTitle>
//                 </DialogHeader>
//                 <form
//                     id="add-catering-menu-form"
//                     action={handleSubmit}
//                     className="grid gap-4 py-4"
//                 >
//                     <div className="grid grid-cols-4 gap-2 items-center">
//                         <Label htmlFor="name" className="text-right">
//                             Name
//                         </Label>
//                         <Input
//                             placeholder="Name"
//                             name="name"
//                             className="col-span-3"
//                         />
//                     </div>
//                     <div className="grid grid-cols-4 gap-2 items-center">
//                         <Label htmlFor="price" className="text-right">
//                             Price
//                         </Label>
//                         <Input
//                             placeholder="Price"
//                             name="price"
//                             className="col-span-3"
//                         />
//                     </div>
//                     <div className="grid grid-cols-4 gap-2 items-center">
//                         <Label htmlFor="description" className="text-right">
//                             Description
//                         </Label>
//                         <Textarea
//                             placeholder="Description"
//                             name="description"
//                             className="col-span-3"
//                         />
//                     </div>
//                     <div className="grid grid-cols-4 gap-2 items-center">
//                         <Label htmlFor="disabled" className="text-right">
//                             Disabled
//                         </Label>
//                         <Switch />
//                     </div>
//                     <div className="grid grid-cols-4 gap-2 items-center">
//                         <Label htmlFor="image" className="text-right">
//                             Image
//                         </Label>
//                         <Input
//                             type="file"
//                             id="image"
//                             name="image"
//                             className="col-span-3"
//                         />
//                     </div>
//                 </form>
//                 <DialogFooter className="flex justify-end">
//                     <LoadingButton
//                         isLoading={loading}
//                         size={"sm"}
//                         type="submit"
//                         form="add-catering-menu-form"
//                     >
//                         Create
//                     </LoadingButton>
//                 </DialogFooter>
//             </DialogContent>
//         </Dialog>
//     );
// };

// export default AddCateringMenuDialog;

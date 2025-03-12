import { Schema, model, models } from "mongoose";
import { CateringCategoryDocument } from "./types/catering-category";

const CateringCategorySchema = new Schema<CateringCategoryDocument>(
    {
        name: {
            type: String,
            required: true,
        },
    },
    { versionKey: false }
);

const CateringCategory =
    models?.CateringCategory ||
    model<CateringCategoryDocument>("CateringCategory", CateringCategorySchema);
export default CateringCategory;

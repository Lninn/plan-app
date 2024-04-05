import mongoose from "mongoose";

export interface Categories extends mongoose.Document {
  label: string;
  value: string;
  children: Categories[];
}

/* CategorySchema will correspond to a collection in your MongoDB database. */
const CategorySchema = new mongoose.Schema<Categories>({
  label: {
    /* The label of this Category */

    type: String,
    required: [true, "Please provide a label for this Category."],
    maxlength: [60, "Label cannot be more than 60 characters"],
  },
  value: {
    /* The value of this Category */

    type: String,
    required: [true, "Please provide the pet owner's name"],
    maxlength: [60, "value cannot be more than 60 characters"],
  },
  children: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
      children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
    }
  ],
}, { _id: false });

export default mongoose.models.Category || mongoose.model<Categories>("Category", CategorySchema);

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
    required: [true, "请提供此分类的label"],
    maxlength: [60, "label不能超过60个字符"],
  },
  value: {
    /* The value of this Category */

    type: String,
    required: [true, '请提供此分类的value'],
    maxlength: [60, 'value不能超过60个字符'],
  },
  children: [
    {
      label: { type: String, required: true },
      value: { type: String, required: true },
      children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }]
    }
  ],
});

export default mongoose.models.Category || mongoose.model<Categories>("Category", CategorySchema);

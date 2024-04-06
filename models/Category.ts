import mongoose from "mongoose";

export interface Categories extends mongoose.Document {
  label: string;
  value: string;
  createdAt: string;
  children: Categories[];
}

const childCategorySchema = new mongoose.Schema({
  label: {
    type: String,
    required: [true, "请提供子分类的label"],
    maxlength: [60, "label不能超过60个字符"],
  },
  value: {
    type: String,
    required: [true, '请提供子分类的value'],
    maxlength: [60, 'value不能超过60个字符'],
  },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }],
}, { timestamps: true });

const CategorySchema = new mongoose.Schema<Categories>({
  label: {
    type: String,
    required: [true, "请提供此分类的label"],
    maxlength: [60, "label不能超过60个字符"],
  },
  value: {
    type: String,
    required: [true, '请提供此分类的value'],
    maxlength: [60, 'value不能超过60个字符'],
  },
  children: [childCategorySchema],
}, { timestamps: true });

export default mongoose.models.Category || mongoose.model<Categories>("Category", CategorySchema);

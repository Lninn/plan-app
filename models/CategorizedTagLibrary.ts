import mongoose from "mongoose";

export interface CategorizedTagLibraries extends mongoose.Document {
  title: string;
  url: string;
  icon: string;
  categories: string[]
  tags: string[]
  createdAt: string;
  updatedAt: string;
}

/* CategorySchema will correspond to a collection in your MongoDB database. */
const CategorizedTagLibrarySchema = new mongoose.Schema<CategorizedTagLibraries>({
  title: {
    type: String,
    required: [true, '请输入标题'],
    maxlength: [60, '标题最多60个字符'],
  },
  url: {
    type: String,
    required: [true, '请输入链接'],
  },
  icon: {
    type: String,
    required: [true, '请输入图标'],
  },
  categories: {
    type: [String],
    default: [],
    required: [true, '请输入分类'],
    length: [2, '最多2个分类'],
  },
  tags: {
    type: [String],
    default: [],
    required: [true, '请输入标签'],
    maxlength: [60, '最多60个标签'],
  }
}, { _id: true, timestamps: true });

export default mongoose.models.CategorizedTagLibrary || mongoose.model<CategorizedTagLibraries>("CategorizedTagLibrary", CategorizedTagLibrarySchema);

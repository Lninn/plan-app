import mongoose from "mongoose";

export interface CategorizedTagLibraries extends mongoose.Document {
  title: string;
  url: string;
  icon: string;
  categories: string[]
  tags: string[]
}

/* CategorySchema will correspond to a collection in your MongoDB database. */
const CategorizedTagLibrarySchema = new mongoose.Schema<CategorizedTagLibraries>({
  title: {
    type: String,
    required: [true, "title is required"],
    maxlength: [60, "count cannot be more than 60 characters"],
  },
  url: {
    type: String,
    required: [true, "url is required"],
    maxlength: [60, "count cannot be more than 60 characters"],
  },
  icon: {
    type: String,
    required: [true, "icon is required"],
    maxlength: [60, "count cannot be more than 60 characters"],
  },
  categories: {
    type: [String],
    default: [],
    required: [true, "categories are required"],
    length: [2, "no more than 2 categories allowed"],
  },
  tags: {
    type: [String],
    default: [],
    required: [true, "tags are required"],
    maxlength: [60, "count cannot be more than 60 characters"],
  }
}, { _id: false });

export default mongoose.models.CategorizedTagLibrary || mongoose.model<CategorizedTagLibraries>("CategorizedTagLibrary", CategorizedTagLibrarySchema);

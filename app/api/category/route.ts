import dbConnect from "@/lib/dbConnect"
import Category from '@/models/Category'

export async function GET() {
  await dbConnect()

  const result= await Category.find()

  return Response.json({ data: result })
}

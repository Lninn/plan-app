import dbConnect from "@/lib/dbConnect"
import CategorizedTagLibrary from '@/models/CategorizedTagLibrary'

export async function queryList() {

  await dbConnect()

  const result= await CategorizedTagLibrary.find()

  // console.log('接口访问成功', { result })

  return Response.json({ ok: true, data: result })
}

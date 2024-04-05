import dbConnect from "@/lib/dbConnect"
import Category from '@/models/Category'


export async function GET() {
  await dbConnect()

  const result= await Category.find()

  return Response.json({ data: result })
}

export async function POST(request: Request) {
  await dbConnect()

  const {
    firstCategory,
    secondCategory
  } = await request.json()

  const document = [
    {
      label: firstCategory,
      value: secondCategory,
      children: [
        {
          label: firstCategory,
          value: secondCategory,
        }
      ]
    },
  ]

  try {
    const data = await Category.create(document)
    return Response.json({ ok: true, data })
  } catch (error) {
    return Response.json({ ok: false, msg: '服务端错误' })
  }
}

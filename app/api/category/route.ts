import dbConnect from "@/lib/dbConnect"
import Category, { Categories } from '@/models/Category'


export async function GET() {
  await dbConnect()

  const result= await Category.find()

  return Response.json({ data: result })
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const { firstCategory, secondCategory } = await request.json();

    if (firstCategory === secondCategory) {
      return Response.json({ ok: false, msg: '一级分类名称和二级分类名称不能相同' });
    }

    const existingCategories: Categories[] = await Category.find({
      $or: [
        { value: firstCategory },
        { 'children.value': secondCategory }
      ]
    });

    const firstLevelExists = existingCategories.some(cat => cat.value === firstCategory);
    const secondLevelExists = existingCategories.some(cat => cat.children.some(child => child.value === secondCategory));

    if (secondLevelExists) {
      // 如果二级分类已存在，则不需要重复创建
      return Response.json({ ok: false, msg: '二级分类已存在，无需重复添加' });
    }

    if (firstLevelExists) {
      // 如果一级分类已存在，则更新它，添加二级分类
      const updatedCategory = await Category.updateOne(
        { value: firstCategory },
        { $push: { children: { label: secondCategory, value: secondCategory } } }
      );

      return Response.json({ ok: true, msg: '更新成功', updatedCategory });
    }

    // 如果一级分类和二级分类都不存在，则创建新的分类
    const documentDraft = [
      {
        label: firstCategory,
        value: firstCategory,
        children: [
          {
            label: secondCategory,
            value: secondCategory,
          }
        ]
      },
    ];

    const createdQuery = await Category.create(documentDraft);
    return Response.json({ ok: true, msg: '创建成功', data: createdQuery });
  } catch (error) {
    console.error('[服务端错误]', error);
    const msg = error instanceof Error ? error.message : '服务端错误';
    return Response.json({ ok: false, msg });
  }
}

export async function DELETE() {
  await dbConnect()

  try {
    const query = await Category.deleteMany()
    return Response.json({ ok: true, query })
  } catch (error) {
    return Response.json({ ok: false, msg: '服务端错误' })
  }
}

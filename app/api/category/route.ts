import dbConnect from "@/lib/dbConnect"
import Category, { Categories } from '@/models/Category'


function pruneUnnecessaryFields(queries: Categories[] | undefined | null): Categories[] | undefined {
  if (!queries) {
    return undefined;
  }

  const prunedQueries = queries.map(query => {
    if (!query || !query.children) {
      return undefined;
    }

    // 创建新的Category对象，将_id的值赋给id，并包含其他必要字段
    return {
      id: query._id,
      label: query.label,
      value: query.value,
      createdAt: foramtDatetime(query.createdAt),
      children: query.children.map(child => ({
        id: child._id,
        label: child.label,
        value: child.value,
        createdAt: foramtDatetime(child.createdAt),
      }))
    };
  }).filter(Boolean) as Categories[];

  return prunedQueries;
}

function foramtDatetime(dateString: string) {
  const date = new Date(dateString);
  return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
}

export async function GET() {
  
  try {
    await dbConnect()
  
    const listQuery = await Category.find()
    // console.log('debug ', JSON.stringify(listQuery, null, 2))

    const prunedQueries = pruneUnnecessaryFields(listQuery)
    return Response.json({ ok: true, data: prunedQueries })
  } catch (error) {
    return Response.json({ ok: false, msg: '获取失败' })
  }
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

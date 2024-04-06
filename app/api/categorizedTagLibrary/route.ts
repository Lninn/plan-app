import dbConnect from "@/lib/dbConnect";
import { queryList } from "./queryList"
import CategorizedTagLibrary, { CategorizedTagLibraries } from '@/models/CategorizedTagLibrary'
import mongoose from 'mongoose'
import { CategorizedTagInfo } from "@/shared/type";

export async function GET(request: Request) {
  return await queryList()
}

export async function POST(request: Request) {
  try {
    await dbConnect();

    const bodyData = await request.json();
    if (!bodyData || !bodyData.list || !Array.isArray(bodyData.list)) {
      return Response.json({ ok: false, msg: '请提供参数，参考 { list: any[] }' });
    }

    const createdQuery = await CategorizedTagLibrary.create(bodyData.list);
    return Response.json({ ok: true, msg: '创建成功', data: createdQuery });
  } catch (errorInfo) {
    console.log('[errorInfo] ', errorInfo);

    if (errorInfo instanceof mongoose.Error.ValidationError) {
      return Response.json({ ok: false, msg: errorInfo.message });
    }

    return Response.json({ ok: false, msg: '服务端错误' });
  }
}

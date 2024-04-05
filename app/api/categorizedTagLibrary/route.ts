import { queryList } from "./queryList"


export async function GET(request: Request) {
  return await queryList()
}

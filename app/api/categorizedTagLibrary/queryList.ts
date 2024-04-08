import dbConnect from "@/lib/dbConnect"
import CategorizedTagLibrary, { CategorizedTagLibraries } from '@/models/CategorizedTagLibrary'

export async function queryList(): Promise<CategorizedTagLibraries[]> {
  try {
    await dbConnect()

    return await CategorizedTagLibrary.find()
  } catch (error) {
    console.log('[queryList]', error)
    return []
  }
}

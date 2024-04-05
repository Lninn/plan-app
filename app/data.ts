import { getRandomIcon } from "./mock-helper";
import { ILinkInfo } from "./type";
import { getUUID } from "./uuid";


export function createLinkRecord(
  {
    title,
    url,
    tags,
    categories,
  }: Pick<ILinkInfo, 'title' | 'url' | 'tags' | 'categories'>
): ILinkInfo {
  return {
    id: getUUID(),
    title,
    url,
    tags,
    categories,
    icon: getRandomIcon(),
  }
}

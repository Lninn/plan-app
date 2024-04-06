export interface CategorizedTagInfo {
  id: string;
  title: string
  url: string
  icon: string
  categories: string[]
  tags: string[]
}

export const enum Env {
  dev = 'development',
  prod = 'production',
}

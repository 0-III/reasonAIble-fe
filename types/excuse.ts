export interface Excuse {
  id: string
  situation: string
  excuse: string
  modifiedExcuse?: string
  createdAt: string
  usageCount?: number
  saturation?: number
}

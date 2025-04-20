export interface Excuse {
  id: string;
  situation?: string | null;
  excuse: string;
  modifiedExcuse?: string;
  createdAt: string;
  usageCount?: number;
  saturation?: number;
}

export type DtoProductCategory = {
  id?: number | null;
  slug: string;
  name: string;
  desc?: string | null;
  parent_id?: number | null;
  is_active?: boolean | null;
}
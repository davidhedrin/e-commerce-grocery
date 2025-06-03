import { PictureTypeEnum } from "@prisma/client";

export type DtoProductCategory = {
  id?: number | null;
  slug?: string | null;
  name: string;
  desc?: string | null;
  is_active?: boolean | null;
}

export type DtoProduct = {
  id?: number | null;
  slug?: string | null;
  name: string;
  desc?: string | null;
  short_desc?: string | null;
  category_id?: number | null;
  brand?: string | null;
  uom?: string | null;
  img_type?: PictureTypeEnum;
  img?: string | null;
  file_img?: File | null;
  is_active?: boolean | null;
};

export type DtoProductVariant = {
  id?: number | null;
  product_id?: number | null;
  sku?: string | null;
  barcode?: string | null;
  name: string | null;
  price?: string | null;
  disc_price?: string | null;
  stock_qty?: string | null;
  img_type?: PictureTypeEnum;
  img?: string | null;
  file_img?: File | null;
  is_active?: boolean | null;
};
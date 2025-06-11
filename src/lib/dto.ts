import { PictureTypeEnum } from "@prisma/client";

export type DtoProductCategory = {
  id?: number | null;
  slug?: string | null;
  name: string;
  desc?: string | null;
  is_active?: boolean | null;
}

export type DtoProduct = {
  id: number | null;
  name: string;
  desc: string | null;
  short_desc: string | null;
  category_id: number | null;
  brand: string | null;
  uom: string | null;
  img_type: PictureTypeEnum | null;
  img_url: string | null;
  img_name: string | null;
  file_img: File | null;
  is_active: boolean | null;

  variants: DtoProductVariant[],
};

export type DtoProductVariant = {
  id: number | null;
  product_id: number | null;
  sku: string;
  barcode: string | null;
  name: string;
  price: number;
  disc_price: number | null;
  desc: string | null;
  img_type: PictureTypeEnum | null;
  img_url: string | null;
  img_name: string | null;
  file_img: File | null;
  is_active: boolean | null;
};
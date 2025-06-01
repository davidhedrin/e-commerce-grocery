"use server";

import { DtoProductCategory } from "@/lib/dto";
import { db } from "../../prisma/db";
import { auth } from "@/lib/auth-setup";
import { PaginateResult, CommonParams } from "@/lib/models-type";
import { Prisma, Product, ProductCategory } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { stringWithTimestamp } from "@/lib/utils";

// Start Product Category
type GetDataProductCategoryParams = {
  where?: Prisma.ProductCategoryWhereInput;
  orderBy?: Prisma.ProductCategoryOrderByWithRelationInput | Prisma.ProductCategoryOrderByWithRelationInput[];
  select?: Prisma.ProductCategorySelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataProductCategory(params: GetDataProductCategoryParams): Promise<PaginateResult<ProductCategory>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.productCategory.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select
    }),
    db.productCategory.count({ where })
  ]);

  return {
    data,
    meta: {
      page: curPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total/perPage)
    }
  };
};
export async function StoreUpdateDataProductCategory(formData: DtoProductCategory) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const data_id = formData.id ?? 0;
    await db.productCategory.upsert({
      where: { id: data_id },
      update: {
        name: formData.name,
        desc: formData.desc,
        is_active: formData.is_active,
        updatedBy: user?.email
      },
      create: {
        slug: stringWithTimestamp(5),
        name: formData.name,
        desc: formData.desc,
        is_active: formData.is_active,
        createdBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export async function GetDataProductCategoryById(id: number): Promise<ProductCategory | null> {
  const getData = await db.productCategory.findUnique({
    where: { id }
  });
  return getData;
};
export async function DeleteDataProductCategory(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.productCategory.update({
      where: { id },
      data: {
        deletedAt: new Date(),
        deletedBy: user?.email
      }
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};
// End Product Category

// Start Product
type GetDataProductParams = {
  where?: Prisma.ProductWhereInput;
  orderBy?: Prisma.ProductOrderByWithRelationInput | Prisma.ProductOrderByWithRelationInput[];
  select?: Prisma.ProductSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataProduct(params: GetDataProductParams): Promise<PaginateResult<
Product  & { category: ProductCategory | null}>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.product.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select: {
        ...select,
        category: select?.category,
      }
    }),
    db.product.count({ where })
  ]);

  return {
    data,
    meta: {
      page: curPage,
      limit: perPage,
      total,
      totalPages: Math.ceil(total/perPage)
    }
  };
};
// End Product
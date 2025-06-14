"use server";

import { DtoProduct, DtoProductCategory } from "@/lib/dto";
import { db } from "../../prisma/db";
import { auth } from "@/lib/auth-setup";
import { PaginateResult, CommonParams, UploadFileRespons } from "@/lib/models-type";
import { PictureTypeEnum, Prisma, Product, ProductCategory, ProductVariant } from "@prisma/client";
import { DefaultArgs } from "@prisma/client/runtime/library";
import { stringWithTimestamp } from "@/lib/utils";
import { DeleteFile, UploadFile } from "./common";

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
export async function StoreUpdateDataProduct(formData: DtoProduct) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;

    const directoryImg = "public/upload/product";
    const data_id = formData.id ?? 0;
    const listVariant = formData.variants;

    const findProdForImg = await db.product.findUnique({
      where: { id: data_id }
    });
    if(findProdForImg && findProdForImg.img_type === PictureTypeEnum.FILE && formData.img_type !== PictureTypeEnum.FILE){
      if(findProdForImg.img_name) await DeleteFile(directoryImg, findProdForImg.img_name);
    };
    if(formData.img_type === PictureTypeEnum.FILE && formData.file_img != null){
      var upFile = await UploadFile(formData.file_img, directoryImg);
      if(upFile != null && upFile.status == true){
        formData.img_name = upFile.filename;
        formData.img_url = `upload/product/${upFile.filename}`;
        if(findProdForImg && findProdForImg.img_name) await DeleteFile(directoryImg, findProdForImg.img_name);
      }
    };

    await db.$transaction(async (tx) => {
      const productData = await tx.product.upsert({
        where: { id: data_id },
        update: {
          name: formData.name,
          desc: formData.desc,
          short_desc: formData.short_desc,
          category_id: formData.category_id,
          brand: formData.brand,
          uom: formData.uom,
          img_type: formData.img_type,
          img_url: formData.img_url,
          img_name: formData.img_name,
          is_active: formData.is_active,
          updatedBy: user?.email
        },
        create: {
          slug: stringWithTimestamp(6),
          name: formData.name,
          desc: formData.desc,
          short_desc: formData.short_desc,
          category_id: formData.category_id,
          brand: formData.brand,
          uom: formData.uom,
          img_type: formData.img_type,
          img_url: formData.img_url,
          img_name: formData.img_name,
          is_active: formData.is_active,
          createdBy: user?.email
        }
      });
      
      if(data_id > 0){
        const getExistData = await tx.productVariant.findMany({
          where: {
            product_id: data_id
          }
        });
        const incomingIds = listVariant.filter(x => x.id).map(x => x.id);
        const toDelete = getExistData.filter(x => !incomingIds.includes(x.id));
        const deleteDatas = toDelete.map(item =>
          tx.productVariant.delete({
            where: { id: item.id }
          })
        );

        const listDirDelete: string[] = [];
        const updateOrCreate = await Promise.all(listVariant.map(async (x) => {
          const findInExist = getExistData.find(y => y.id == x.id);
          if(x.img_type === PictureTypeEnum.FILE && x.file_img != null){
            var upFileVar = await UploadFile(x.file_img, directoryImg, "variant");
            if(upFileVar != null && upFileVar.status == true){
              x.img_name = upFileVar.filename;
              x.img_url = `upload/product/${upFileVar.filename}`;
              if(findInExist && findInExist.img_name) listDirDelete.push(findInExist.img_name);
            }
          };

          if(x.id && x.id > 0){
            if(findInExist && findInExist.img_type === PictureTypeEnum.FILE){
              if(x.img_type !== PictureTypeEnum.FILE || x.img_url === null) if(findInExist.img_name) listDirDelete.push(findInExist.img_name);
            };

            const updateData: any = {
              barcode: x.barcode,
              name: x.name,
              price: x.price,
              disc_price: x.disc_price,
              desc: x.desc,
              img_type: x.img_type,
              img_url: x.img_url,
              img_name: x.img_name,
              is_active: x.is_active,
              updatedBy: user?.email,
            };
            if (findInExist?.sku !== x.sku) updateData.sku = x.sku;

            return tx.productVariant.update({
              where: { id: x.id },
              data: updateData
            });
          } else {
            return tx.productVariant.create({
              data: {
                product_id: productData.id,
                sku: x.sku,
                barcode: x.barcode,
                name: x.name,
                price: x.price,
                disc_price: x.disc_price,
                stock_qty: 0,
                desc: x.desc,
                img_type: x.img_type,
                img_url: x.img_url,
                img_name: x.img_name,
                is_active: x.is_active,
                createdBy: user?.email
              }
            });
          };
        }));
        
        await Promise.all([...updateOrCreate, ...deleteDatas, listDirDelete.forEach(async (z) => await DeleteFile(directoryImg, z))]);
      }else{
        const setListVariant = await Promise.all(listVariant.map(async (x) => {
          if(x.img_type === PictureTypeEnum.FILE && x.file_img != null){
            var upFileVar = await UploadFile(x.file_img, directoryImg, "variant");
            if(upFileVar != null && upFileVar.status == true){
              x.img_name = upFileVar.filename;
              x.img_url = `upload/product/${upFileVar.filename}`;
            }
          };
          return {
            product_id: productData.id,
            sku: x.sku,
            barcode: x.barcode,
            name: x.name,
            price: x.price,
            disc_price: x.disc_price,
            stock_qty: 0,
            desc: x.desc,
            img_type: x.img_type,
            img_url: x.img_url,
            img_name: x.img_name,
            is_active: x.is_active,
            createdBy: user?.email
          }
        }));

        await tx.productVariant.createMany({
          data: setListVariant
        });
      }
    })
  } catch (error: any) {
    throw new Error(error.message);
  }
};
export async function GetDataProductById(id: number): Promise<Product & {
  variants: ProductVariant[]
  category: ProductCategory | null
} | null> {
  const getData = await db.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: {
          id: "asc",
        }
      },
      category: true
    }
  });

  return getData;
};
export async function DeleteDataProduct(id: number) {
  try {
    const session = await auth();
    if(!session) throw new Error("Authentication credential not Found!");
    const { user } = session;
    
    await db.$transaction(async (tx) => {
      await tx.productVariant.updateMany({
        where: {
          product_id: id
        },
        data: {
          deletedAt: new Date(),
          deletedBy: user?.email
        }
      });

      await tx.product.update({
        where: { id },
        data: {
          deletedAt: new Date(),
          deletedBy: user?.email
        }
      })
    });
  } catch (error: any) {
    throw new Error(error.message);
  }
};

type GetDataProductVariantParams = {
  where?: Prisma.ProductVariantWhereInput;
  orderBy?: Prisma.ProductVariantOrderByWithRelationInput | Prisma.ProductVariantOrderByWithRelationInput[];
  select?: Prisma.ProductVariantSelect<DefaultArgs> | undefined;
} & CommonParams;
export async function GetDataProductVariant(params: GetDataProductVariantParams): Promise<PaginateResult<ProductVariant>> {
  const { curPage = 1, perPage = 10, where = {}, orderBy = {}, select } = params;
  const skip = (curPage - 1) * perPage;
  const [data, total] = await Promise.all([
    db.productVariant.findMany({
      skip,
      take: perPage,
      where,
      orderBy,
      select
    }),
    db.productVariant.count({ where })
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
import React from 'react';

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Plus } from "lucide-react";
import { Badge } from './ui/badge';
import { Product, ProductCategory, ProductVariant } from '@prisma/client';
import { formatToIDR } from '@/lib/utils';

type ProductCatalogProp = {
  product: Product & { category: ProductCategory | null, variants: ProductVariant[] | null };
};

export default function ProductCatalog({
  product,
}: ProductCatalogProp) {
  const firstVariant: ProductVariant | null = product.variants ? product.variants[0] : null;

  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg py-0 gap-0">
      <div className="relative">
        <img src={product.img_url || ""} alt="" className="w-full h-24 object-cover cursor-pointer" />
        <Badge className="absolute top-2 left-2 bg-red-500 text-white">
          Baru
        </Badge>
      </div>

      <CardContent className="p-3 flex flex-col gap-1">
        <div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <span>⭐ 4.2</span><span>•</span><span>12 sold</span>
          </div>
          <h3 className="font-semibold text-base truncate underline cursor-pointer">{product.name}</h3>
          <p className="text-sm">{product.category?.name}</p>
        </div>
        <div className="flex items-end justify-between mt-2">
          <div className="text-primary">
            {
              firstVariant && firstVariant.disc_price && (
                <div className="text-xs line-through text-muted-foreground">
                  Rp {firstVariant ? formatToIDR(firstVariant.disc_price) : "-"}
                </div>
              )
            }
            <div className="text-sm font-bold text-primary">
              Rp {firstVariant ? formatToIDR(firstVariant.price) : "-"}
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button className="rounded-full border p-1 hover:bg-muted transition cursor-pointer">
              <Heart className="h-4 w-4" />
            </button>
            <button className="rounded-full border p-1 bg-blue-600 text-white transition cursor-pointer">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

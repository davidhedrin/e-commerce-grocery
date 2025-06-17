import React from 'react';

import { Card, CardContent } from "@/components/ui/card";
import { Heart, Plus } from "lucide-react";
import { Badge } from './ui/badge';
import { Product, ProductCategory } from '@prisma/client';

type ProductCatalogProp = {
product: Product & { category: ProductCategory | null };
};

export default function ProductCatalog({
product,
}: ProductCatalogProp) {
  return (
    <Card className="overflow-hidden transition-shadow hover:shadow-lg py-0 gap-0">
      <div className="relative">
        <img src={product.img_url || ""} alt="" className="w-full h-28 object-cover cursor-pointer" />
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
          <div className="text-primary text-lg">
            <div className="text-sm line-through text-muted-foreground">
              Rp 15.000
            </div>
            <div className="font-bold text-primary">
              Rp 2.000
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="rounded-full border p-2 hover:bg-muted transition cursor-pointer">
              <Heart className="h-4 w-4" />
            </button>
            <button className="rounded-full border p-2 bg-blue-600 text-white transition cursor-pointer">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

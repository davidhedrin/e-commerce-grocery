"use client"

import { useLoading } from "@/components/loading-context";
import ProductCatalog from "@/components/product-catalog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { GetDataProductRandom } from "@/server/product";
import { Product, ProductCategory, ProductVariant } from "@prisma/client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { setLoading } = useLoading();

  const [perPage, setPerPage] = useState(10);
  const [datas, setDatas] = useState<(Product & { category: ProductCategory | null, variants: ProductVariant[] | null })[] | null>(null);
  const fatchDatasRandomProduct = async () => {
    try {
      const result = await GetDataProductRandom(perPage, {
        id: true,
        name: true,
        brand: true,
        uom: true,
        img_type: true,
        img_url: true,
        img_name: true,
        category: {
          select: {
            slug: true,
            name: true
          }
        },
        variants: {
          take: 1,
          orderBy: {
            price: 'asc'
          },
          select: {
            price: true,
            disc_price: true
          }
        }
      });
      setDatas(result);
    } catch (error: any) {
      toast.warning("Something's gone wrong!", {
        description: "We can't proccess your request, Please try again.",
      });
    }
  };

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const firstInit = async () => {
      await fatchDatasRandomProduct();
      setIsFirstRender(false);
      setLoading(false);
    };
    firstInit();
  }, []);

  return (
    <div>
      <section className="relative h-[400px] md:h-[500px] bg-cover bg-center" style={{ backgroundImage: "url('/assets/img/home_banner.jpg" }}>
        <div className="absolute inset-0 bg-gradient-to-b from-blue-400 to-transparent" />

        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <h1 className="text-4xl md:text-4xl font-bold mb-4 text-white">Grocery Shopping Made Simple</h1>
          <p className="text-sm md:text-lg mb-6 max-w-xl text-white">
            Discover fresh produce, fruits, and everyday essentials - sourced directly from trusted farms and suppliers.
          </p>

          <div className="w-full max-w-xl relative mb-6">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <Input
              type="text"
              placeholder="Search here to find products..."
              className="pl-10 pr-4 py-5 text-sm rounded-xl shadow-lg bg-white dark:bg-white focus-visible:ring-2 focus-visible:ring-blue-500"
            />
          </div>

          <div className="space-x-3">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
              Find Advance Here
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-6">
        <div className="font-bold mb-2 text-muted-foreground">
          Special For You
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-3">
          {
            datas?.map((x, i) => {
              return <ProductCatalog key={i} product={x} />
            })
          }
        </div>
      </div>
    </div>
  );
}

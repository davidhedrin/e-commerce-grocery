"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookMarked, Check, Heart, MessageSquareMore, Minus, Package, Plus } from "lucide-react";
import { GetDataProductById, GetDataProductRandom } from "@/server/product";
import LoadingUI from "@/components/loading-ui";
import { Product, ProductCategory, ProductVariant } from "@prisma/client";
import { formatToIDR } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import BreadcrumbListing from "@/components/breadcrumb-list";
import { toast } from "sonner";
import ProductCatalog from "@/components/product-catalog";

export default function ProductDetail() {
  const searchParams = useSearchParams();
  const product_id = searchParams.get('product_id');

  const [productData, setProductData] = useState<(Product & {
    variants: ProductVariant[]
    category: ProductCategory | null
  }) | null>(null);
  const [qtyActive, setQtyActive] = useState<number>(1);
  const [activeVariant, setActiveVariant] = useState<ProductVariant | null>(null);

  useEffect(() => {
    const firstInit = async () => {
      if (product_id && product_id.trim() !== '') {
        const data = await GetDataProductById(parseInt(product_id));
        console.log(data);

        if (data) {
          setProductData(data);
          setActiveVariant(data?.variants[0]);
        }
      }
    };

    fatchDatasRandomProduct();
    firstInit();
  }, [product_id]);


  const [perPage, setPerPage] = useState(5);
  const [datas, setDatas] = useState<(Product & { category: ProductCategory | null, variants: ProductVariant[] | null })[]>([]);
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

  const listBreadcrumb = [
    { name: "Home", url: "/" },
    { name: "Product Detail" },
    { name: productData ? `"${productData.name}"` : "" }
  ];

  const changeActiveVariant = (variant: ProductVariant) => {
    setActiveVariant(variant);
    setQtyActive(1);
  };

  return (
    <div className="max-w-7xl mx-auto p-4">
      <BreadcrumbListing listBc={listBreadcrumb} />
      {
        productData ? <div className="bg-white dark:bg-zinc-900 p-4 mt-3 rounded-md">
          <div className="flex flex-col lg:flex-row gap-5">
            <div className="relative w-full lg:w-[500px] h-[260px] md:h-[335px]">
              <img
                src={productData.img_url || ""}
                alt="Green Apple Granny Smith"
                className="w-full h-[260px] md:h-[335px] object-cover rounded-lg"
              />
              <Badge className="absolute top-2 left-2 bg-red-500 text-white">In Stock</Badge>

              <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 w-[90%] px-2">
                <div className="overflow-x-auto custom-scrollbar-product-detail">
                  <div className="flex gap-2 w-max px-2 py-1 bg-white/50 backdrop-blur-sm rounded-lg mx-auto">
                    {
                      productData.variants.map((x, i) => {
                        if (x.img_url) return (
                          <div key={i} className="border border-gray-300 rounded-md overflow-hidden hover:opacity-80">
                            <img
                              src={x.img_url}
                              draggable={false}
                              alt="thumb 2"
                              className="w-16 h-12 object-cover"
                            />
                          </div>
                        )
                      })
                    }

                    {/* <div className="border-2 border-blue-500 rounded-md overflow-hidden hover:opacity-80">
                      <img
                        src="https://fisherscart.com/cdn/shop/products/greenapple.png?v=1672232680"
                        draggable={false}
                        alt="thumb 1"
                        className="w-16 h-12 object-cover"
                      />
                    </div> */}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row gap-4 flex-1">
              <div className="w-full lg:w-[400px] min-w-0">
                <div className="text-2xl font-semibold break-words">
                  {productData.name}
                </div>
                <p className="text-sm text-muted-foreground mb-3">{productData.short_desc}</p>

                <div className="flex items-center gap-4 mb-3">
                  <div className="text-sm text-muted-foreground flex items-center gap-2">
                    <span>⭐ 4.2</span>
                    <span>•</span>
                    <span>12 sold</span>
                  </div>
                  {
                    productData.category && <Badge variant={"secondary"}>
                      <strong>{productData.category?.name}</strong>
                    </Badge>
                  }

                </div>

                <div className="mb-2">
                  {
                    activeVariant && activeVariant.disc_price && (
                      <div className="line-through text-muted-foreground">
                        Rp  {activeVariant.disc_price ? formatToIDR(activeVariant.disc_price) : "-"}
                      </div>
                    )
                  }
                  <span className="text-2xl font-bold text-blue-600">
                    Rp {activeVariant ? formatToIDR(activeVariant.price) : "-"}
                  </span>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Choose Varian:</p>
                  <div className="flex flex-wrap gap-2">
                    {
                      productData.variants.map((x, i) => (
                        <Button onClick={() => changeActiveVariant(x)} key={i} variant="outline" size="sm"
                          className={
                            `
                            ${activeVariant && activeVariant.id == x.id && "flex items-center gap-1 border-blue-500 bg-blue-100 text-blue-700 hover:bg-blue-100 hover:text-blue-700"}
                            rounded-full px-4 cursor-pointer
                            `
                          }
                        >
                          {
                            activeVariant && activeVariant.id == x.id && <Check />
                          }
                          {x.name}
                        </Button>
                      ))
                    }
                  </div>
                </div>

                <div className="mb-2">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Amount:</p>
                  <div className="flex items-center border border-gray-400 rounded-md w-fit px-1 gap-0">
                    <Button onClick={() => {
                      if (qtyActive > 1) setQtyActive(prev => prev - 1)
                    }} variant="ghost" size="icon" className="text-xl cursor-pointer">
                      <Minus />
                    </Button>
                    <Input
                      type="number"
                      value={qtyActive}
                      onChange={(e) => {
                        const val = parseInt(e.target.value);
                        if (!isNaN(val) && val > 0 && (!activeVariant || val <= activeVariant.stock_qty)) {
                          setQtyActive(val);
                        }
                      }}
                      className="w-12 input-no-spinner text-center bg-transparent border-none focus-visible:ring-0 focus-visible:ring-offset-0 p-0 text-sm"
                    />
                    <Button onClick={() => {
                      if (activeVariant && activeVariant.stock_qty > qtyActive) setQtyActive(prev => prev + 1)
                    }} variant="ghost" size="icon" className="text-xl cursor-pointer">
                      <Plus />
                    </Button>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-muted-foreground">Stock Remaining:</p>
                  <div className="flex items-center gap-2">
                    <Package className="w-5 h-5 text-green-700" />
                    <span>
                      <strong className="font-semibold">{activeVariant?.stock_qty}</strong> <span className="text-muted-foreground text-sm">items left — order now!</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="w-full lg:w-[320px] flex-shrink-0">
                <div className="bg-white dark:bg-zinc-900 shadow-md rounded-lg p-4 border border-gray-200 dark:border-zinc-700 w-full mb-4">
                  <h3 className="flex gap-1 text-sm font-semibold mb-3 border-b border-gray-300 dark:border-zinc-600 pb-2 text-gray-900 dark:text-gray-100">
                    <BookMarked className="w-5 h-5" /> Term & Condition
                  </h3>
                  <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-3">
                    <li>
                      <strong className="text-gray-900 dark:text-white">Brand:</strong> {productData.brand}
                    </li>
                    <li>
                      <strong className="text-gray-900 dark:text-white">UOM:</strong> {productData.uom}
                    </li>
                    <li>
                      <strong className="text-gray-900 dark:text-white">Est-Delivery:</strong> 3 Days (<span className="text-muted-foreground font-semibold">24 - 26</span> June)
                    </li>
                    <li>
                      <strong className="text-gray-900 dark:text-white">Packaging:</strong> Buble Wrap
                    </li>
                    <li>
                      <strong className="text-gray-900 dark:text-white">Storage:</strong> Keep refrigerated
                    </li>
                  </ul>
                </div>

                <div className="flex gap-3 flex-wrap">
                  <Button className="primary" size="sm">
                    <Plus /> Add to Cart
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Heart /> Wishlist
                  </Button>
                  <Button variant="outline" size="sm">
                    <MessageSquareMore /> Ask
                  </Button>
                </div>
              </div>
            </div>
          </div>

          <Separator className="my-4" />

          <div className="font-bold mb-2 text-muted-foreground">
            Product Overview
          </div>
          <div
            className="prose max-w-none"
            dangerouslySetInnerHTML={{ __html: productData.desc || "" }}
          />

          <Separator className="my-4" />
          <div className="font-bold mb-2 text-muted-foreground">
            Reviews (20)
          </div>
        </div> : <LoadingUI className="relative py-36" />
      }

      <div className="font-bold mb-2 mt-6 text-muted-foreground">
        Recomendation Product
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-3">
        {
          datas.map((x, i) => {
            return <ProductCatalog key={i} product={x} />
          })
        }
      </div>
    </div>
  )
}

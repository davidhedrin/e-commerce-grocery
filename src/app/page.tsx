"use client"

import { useLoading } from "@/components/loading-context";
import ProductCatalog from "@/components/product-catalog";
import TablePagination from "@/components/table-pagination";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { TableShortList, TableThModel } from "@/lib/models-type";
import { normalizeSelectObj, sortListToOrderBy } from "@/lib/utils";
import { GetDataProduct } from "@/server/product";
import { Product, ProductCategory } from "@prisma/client";
import { Search } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const { setLoading } = useLoading();

  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<(Product & { category: ProductCategory | null })[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Code", key: "slug", key_sort: "slug", IsVisible: true },
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Brand", key: "brand", key_sort: "brand", IsVisible: true },
    { name: "Category", key: "category[slug,name]", key_sort: "category.name", IsVisible: true },
    { name: "UOM", key: "uom", key_sort: "uom", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataProduct({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
            { slug: { contains: inputSearch.trim(), mode: "insensitive" } },
            { brand: { contains: inputSearch.trim(), mode: "insensitive" } },
            {
              category: {
                OR: [
                  { name: { contains: inputSearch.trim(), mode: "insensitive" } }
                ]
              }
            }
          ]
        },
        select: {
          id: true,
          img_type: true,
          img_url: true,
          img_name: true,
          ...selectObj
        },
        orderBy: orderObj
      });
      setTotalPage(result.meta.totalPages);
      setTotalCount(result.meta.total);
      setPageTable(result.meta.page);
      setInputPage(result.meta.page.toString());

      setDatas(result.data);
    } catch (error: any) {
      toast.warning("Something's gone wrong!", {
        description: "We can't proccess your request, Please try again.",
      });
    }
  };

  useEffect(() => {
    if (isFirstRender) return;
    if (tblSortList.length === 0) fatchDatas();
  }, [tblSortList]);
  useEffect(() => {
    if (isFirstRender) return;
    fatchDatas(1);
  }, [tblThColomns]);
  useEffect(() => {
    if (isFirstRender) return;
    const timer = setTimeout(() => {
      fatchDatas(1);
    }, 400);
    return () => clearTimeout(timer);
  }, [inputSearch]);

  const [isFirstRender, setIsFirstRender] = useState(true);
  useEffect(() => {
    const firstInit = async () => {
      await fatchDatas();
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
              More Advance
            </Button>
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto p-6">
        <h2 className="font-bold mb-2 text-muted-foreground">
          Special For You
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 mb-3">
          {
            datas?.map((x, i) => {
              return <ProductCatalog key={i} product={x} />
            })
          }
        </div>

        <TablePagination
          perPage={perPage}
          pageTable={pageTable}
          totalPage={totalPage}
          totalCount={totalCount}
          setPerPage={setPerPage}
          setPageTable={setPageTable}
          fatchData={fatchDatas}

          inputPage={inputPage}
          setInputPage={setInputPage}
        />
      </div>
    </div>
  );
}

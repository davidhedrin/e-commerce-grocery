import BreadcrumbListing from "@/components/breadcrumb-list";
import { TableShortList, TableThModel } from "@/lib/models-type";
import { normalizeSelectObj, sortListToOrderBy } from "@/lib/utils";
import { GetDataProductCategory } from "@/server/product";
import { ProductCategory } from "@prisma/client";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function Page() {
  const listBreadcrumb = [
    { name: "Warehouse" },
    { name: "Product", url: "/product" },
    { name: "Category Product", url: "/product/category" }
  ];

  // Start Master
  const [inputPage, setInputPage] = useState("1");
  const [pageTable, setPageTable] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [totalPage, setTotalPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [datas, setDatas] = useState<ProductCategory[] | null>(null);
  const [inputSearch, setInputSearch] = useState("");
  const [tblSortList, setTblSortList] = useState<TableShortList[]>([]);
  const [tblThColomns, setTblThColomns] = useState<TableThModel[]>([
    { name: "Code", key: "slug", key_sort: "slug", IsVisible: true },
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Description", key: "desc", key_sort: "desc", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: true },
    { name: "Created At", key: "createdAt", key_sort: "createdAt", IsVisible: true },
  ]);
  const fatchDatas = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomns);
    const orderObj = sortListToOrderBy(tblSortList);

    try {
      const result = await GetDataProductCategory({
        curPage: page,
        perPage: countPage,
        where: {
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
          ],
          parent_id: null
        },
        select: {
          id: true,
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
      // setLoading(true);
      await fatchDatas();
      setIsFirstRender(false);
      // setLoading(false);
    };
    firstInit();
  }, []);
  // End Master

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />
    </>
  )
}
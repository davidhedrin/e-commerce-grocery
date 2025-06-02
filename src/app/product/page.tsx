"use client";

import { UseAlertDialog } from "@/components/alert-confirm";
import BreadcrumbListing from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading-context";
import TablePagination from "@/components/table-pagination";
import TableTopToolbar from "@/components/table-top-toolbar";
import Tiptap from "@/components/rich-text/tiptap";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Textarea } from "@/components/ui/textarea";
import { ZodErrors } from "@/components/zod-errors";
import Configs from "@/lib/config";
import { FormState, TableShortList, TableThModel } from "@/lib/models-type";
import { formatDate, normalizeSelectObj, SonnerPromise, sortListToOrderBy } from "@/lib/utils";
import { GetDataProduct, GetDataProductCategory, GetDataProductVariant } from "@/server/product";
import { Product, ProductCategory, ProductVariant } from "@prisma/client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Page() {
  const { setLoading } = useLoading();
  const { openAlert } = UseAlertDialog();
  const listBreadcrumb = [
    { name: "Warehouse" },
    { name: "Product", url: "/product" }
  ];

  // Start Master
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
          img: true,
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
  // End Master

  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
    };
    firstInit();
  }, []);

  // Modal Add & Edit
  const [openModal, setOpenModal] = useState(false);
  const [stateFormAddEdit, setStateFormAddEdit] = useState<FormState>({ success: false, errors: {} });

  const [addEditId, setAddEditId] = useState<number | null>(null);
  const [isActive, setIsActive] = useState<string>();
  const [txtSlug, setTxtSlug] = useState("");
  const [txtName, setTxtName] = useState("");
  const [txtShortDesc, setTxtShortDesc] = useState("");
  const [txtDesc, setTxtDesc] = useState<string | undefined>();
  const [valueSelectCategory, setValueSelectCategory] = useState("");
  const [valueSelectUom, setValueSelectUom] = useState("");
  const [txtBrand, setTxtBrand] = useState("");
  const FormSchemaAddEdit = z.object({
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    name: z.string().min(1, { message: 'Name is required field.' }).trim(),
    slug: z.string().min(1, { message: 'Slug is required field.' }).trim(),
    category: z.string().min(1, { message: 'Category is required field.' }).trim(),
  });
  const closeModalAddEdit = () => {
    setStateFormAddEdit({ success: true, errors: {} });
    setOpenModal(false);
  };
  // const createDtoData = (): DtoProductCategory => {
  //   const newData: DtoProductCategory = {
  //     id: addEditId,
  //     slug: txtSlug,
  //     name: txtName,
  //     desc: txtDesc.trim() != "" ? txtDesc : null,
  //     is_active: isActive === "true" ? true : false,
  //   };
  //   return newData;
  // };
  const openModalAddEdit = async (id?: number) => {
    // if (id) {
    //   const openSonner = SonnerPromise("Loading open form...");
    //   const data = await GetDataProductCategoryById(id);
    //   if (data) {
    //     setAddEditId(data.id);
    //     setIsActive(data.is_active != null ? data.is_active.toString() : undefined);
    //     setTxtSlug(data.slug);
    //     setTxtName(data.name);
    //     setTxtDesc(data.desc || "");
    //   }
    //   toast.dismiss(openSonner);
    // } else {
    //   setAddEditId(null);
    //   setIsActive(undefined);
    //   setTxtSlug("");
    //   setTxtName("");
    //   setTxtDesc("");
    // }
    setOpenModal(true);
  };
  const handleFormSubmitAddEdit = async (formData: FormData) => {
    formData.append("category", valueSelectCategory);
    const data = Object.fromEntries(formData);
    const valResult = FormSchemaAddEdit.safeParse(data);
    if (!valResult.success) {
      setStateFormAddEdit({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormAddEdit({ success: true, errors: {} });

    setOpenModal(false);
    setTimeout(async () => {
      const confirmed = await openAlert({
        title: 'Submit Confirmation!',
        description: 'Are you sure you want to submit this form? Please double-check before proceeding!',
        textConfirm: 'Yes, Submit',
        textClose: 'No, Go Back',
        icon: 'bx bx-error bx-tada text-blue-500'
      });
      if (!confirmed) {
        setOpenModal(true);
        return;
      }

      const sonnerSubmit = SonnerPromise("Submiting proccess...", "Please wait, trying to submit you request!");
      try {
        // await StoreUpdateDataProductCategory(createDtoData());
        await fatchDatas();
        toast.success("Submit successfully!", {
          description: "Your submission has been successfully completed!",
        });

        setOpenModal(false);
      } catch (error: any) {
        toast.warning("Request Failed!", {
          description: error.message,
        });
      }
      toast.dismiss(sonnerSubmit);
    }, 100);
  };
  const deleteRow = async (id: number) => {
    const confirmed = await openAlert({
      title: 'Delete Confirmation!',
      description: 'Are your sure want to delete this record? You will not abel to undo this action!',
      textConfirm: 'Yes, Delete',
      textClose: 'No, Keep It',
      icon: 'bx bx-trash bx-tada text-red-500'
    });
    if (!confirmed) return;

    const sonnerSubmit = SonnerPromise("Deleting proccess...", "Please wait, deletion data is in progress!");
    try {
      // await DeleteDataProductCategory(id);
      await fatchDatas();
      toast.success("Deletion Complete!", {
        description: "The selected data has been removed successfully!",
      });
    } catch (error: any) {
      toast.warning("Something's gone wrong!", {
        description: "We can't proccess your request, Please try again.",
      });
    }
    toast.dismiss(sonnerSubmit);
  };

  // For Popover Search
  const [openSelectUom, setOpenSelectUom] = useState(false);

  const [inputSearchCategory, setInputSearchCategory] = useState("");
  const [datasCategory, setDatasCategory] = useState<ProductCategory[] | null>(null);
  const [openSelectCategory, setOpenSelectCategory] = useState(false);
  const openPopoverCategory = async (open: boolean) => {
    setInputSearchCategory("");
    await fatchPovDataCategory("");
    setOpenSelectCategory(open);
  };
  const timerRefSearchCategory = useRef<NodeJS.Timeout | null>(null)
  const onChangeSearchPovCategory = (val: string) => {
    setInputSearchCategory(val);
    if (timerRefSearchCategory.current) {
      clearTimeout(timerRefSearchCategory.current)
    }
    timerRefSearchCategory.current = setTimeout(() => {
      fatchPovDataCategory(val)
    }, 400)
  };
  const fatchPovDataCategory = async (search: string = inputSearchCategory) => {
    const getData = await GetDataProductCategory({
      curPage: 1,
      perPage: 5,
      where: {
        is_active: true,
        OR: [
          { name: { contains: search.trim(), mode: "insensitive" } },
          { slug: { contains: search.trim(), mode: "insensitive" } }
        ]
      },
      select: {
        id: true,
        name: true,
        slug: true
      }
    });
    setDatasCategory(getData.data);
  };
  // End Popover Seach

  // Table product variant
  const [openModalVariant, setOpenModalVariant] = useState(false);
  const [inputPageVariant, setInputPageVariant] = useState("1");
  const [pageTableVariant, setPageTableVariant] = useState(1);
  const [perPageVariant, setPerPageVariant] = useState(10);
  const [totalPageVariant, setTotalPageVariant] = useState(0);
  const [totalCountVariant, setTotalCountVariant] = useState(0);
  const [datasVariant, setDatasVariant] = useState<ProductVariant[] | null>(null);
  const [inputSearchVariant, setInputSearchVariant] = useState("");
  const [tblSortListVariant, setTblSortListVariant] = useState<TableShortList[]>([]);
  const [tblThColomnsVariant, setTblThColomnsVariant] = useState<TableThModel[]>([
    { name: "SKU", key: "sku", key_sort: "sku", IsVisible: true },
    { name: "Name", key: "name", key_sort: "name", IsVisible: true },
    { name: "Barcode", key: "barcode", key_sort: "barcode", IsVisible: true },
    { name: "Price", key: "price", key_sort: "price", IsVisible: true },
    { name: "Stock", key: "stock_qty", key_sort: "stock_qty", IsVisible: true },
    { name: "Status", key: "is_active", key_sort: "is_active", IsVisible: false }
  ]);
  const fatchDatasVariant = async (page: number = pageTable, countPage: number = perPage) => {
    const selectObj = normalizeSelectObj(tblThColomnsVariant);
    const orderObj = sortListToOrderBy(tblSortListVariant);

    try {
      const result = await GetDataProductVariant({
        curPage: page,
        perPage: countPage,
        where: {
          product_id: addEditId || 0,
          OR: [
            { name: { contains: inputSearch.trim(), mode: "insensitive" } },
            { sku: { contains: inputSearch.trim(), mode: "insensitive" } },
            { barcode: { contains: inputSearch.trim(), mode: "insensitive" } },
          ]
        },
        select: {
          id: true,
          ...selectObj
        },
        orderBy: orderObj
      });
      setTotalPageVariant(result.meta.totalPages);
      setTotalCountVariant(result.meta.total);
      setPageTableVariant(result.meta.page);
      setInputPageVariant(result.meta.page.toString());

      setDatasVariant(result.data);
    } catch (error: any) {
      toast.warning("Something's gone wrong!", {
        description: "We can't proccess your request, Please try again.",
      });
    }
  };
  const closeModalAddEditVariant = () => {
    setStateFormAddEdit({ success: true, errors: {} });
    setOpenModal(false);
  };
  const openModalAddEditVariant = async (id?: number) => {
    // if (id) {
    //   const openSonner = SonnerPromise("Loading open form...");
    //   const data = await GetDataProductCategoryById(id);
    //   if (data) {
    //     setAddEditId(data.id);
    //     setIsActive(data.is_active != null ? data.is_active.toString() : undefined);
    //   }
    //   toast.dismiss(openSonner);
    // } else {
    //   setAddEditId(null);
    //   setIsActive(undefined);
    // }
    setOpenModalVariant(true);
  };
  // End product variant

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />

      <TableTopToolbar
        tblName="Product List"
        tblDesc="List product catalog to manage your data"
        inputSearch={inputSearch}
        tblSortList={tblSortList}
        thColomn={tblThColomns}
        setTblThColomns={setTblThColomns}
        setTblSortList={setTblSortList}
        setInputSearch={setInputSearch}
        fatchData={() => fatchDatas(pageTable)}

        openModal={() => openModalAddEdit()}
      />

      <div className="overflow-hidden rounded-lg border">
        <Table>
          <TableHeader className="bg-muted sticky top-0 z-10">
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Picture</TableHead>
              {
                tblThColomns.map((x, i) => {
                  if (x.IsVisible) return <TableHead key={x.key}>{x.name}</TableHead>
                })
              }
              <TableHead className="text-right">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {
              datas != null && datas?.length > 0 ? datas.map((data, i) => (
                <TableRow key={data.id}>
                  <TableCell>{(pageTable - 1) * perPage + i + 1}</TableCell>
                  <TableCell>
                    <img src={data.img || ""} alt={data.name} style={{ width: "80px", height: "40px", objectFit: "cover" }} />
                  </TableCell>
                  {
                    'slug' in data && <TableCell>
                      <Badge className="primary">
                        <div className="truncate max-w-[150px]">
                          {data.slug}
                        </div>
                      </Badge>
                    </TableCell>
                  }
                  {'name' in data && <TableCell className="truncate max-w-[160px]">{data.name}</TableCell>}
                  {'brand' in data && <TableCell>{data.brand}</TableCell>}
                  {'category' in data && <TableCell>{data.category ? data.category.name : "-"}</TableCell>}
                  {'uom' in data && <TableCell>{data.uom}</TableCell>}
                  {'is_active' in data && (
                    <TableCell>
                      <div className={`${data.is_active === true ? "text-green-600" : "text-red-600"} font-semibold`}>
                        {data.is_active === true ? "Active" : "Inactive"}
                      </div>
                    </TableCell>
                  )}
                  {'createdAt' in data && (<TableCell>{data.createdAt ? formatDate(data.createdAt, "medium") : "-"}</TableCell>)}

                  <TableCell className="text-right space-x-1">
                    <i className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                    <i className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
                  </TableCell>
                </TableRow>
              )) : <TableRow>
                <TableCell className="text-center" colSpan={tblThColomns.length + 4}><i>No data found!</i></TableCell>
              </TableRow>
            }
          </TableBody>
        </Table>
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


      {/* Modal add & edit */}
      <Dialog open={openModal} onOpenChange={setOpenModal}>
        <DialogContent className="p-0 text-sm sm:max-w-2xl" setOpenModal={() => closeModalAddEdit()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0 p-4 pb-0">
            <DialogTitle className="text-base"><i className='bx bx-package text-lg'></i> {addEditId ? "Edit" : "Add"} Product</DialogTitle>
            <DialogDescription>Here form to handle product data</DialogDescription>
          </DialogHeader>
          <form action={(formData) => handleFormSubmitAddEdit(formData)}>
            <ScrollArea type="always" className="h-[480px]">
              <div className='grid grid-cols-12 gap-3 mb-0 p-4 pt-0'>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="slug">Code<span className="text-red-500">*</span></Label>
                  <div>
                    <Input disabled={addEditId != null} value={txtSlug} onChange={(e) => setTxtSlug(e.target.value)} type="text" id="slug" name="slug" placeholder="Enter product code" />
                    {stateFormAddEdit.errors?.slug && <ZodErrors err={stateFormAddEdit.errors?.slug} />}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="name">Name<span className="text-red-500">*</span></Label>
                  <div>
                    <Input value={txtName} onChange={(e) => setTxtName(e.target.value)} type="text" id="name" name="name" placeholder="Enter product name" />
                    {stateFormAddEdit.errors?.name && <ZodErrors err={stateFormAddEdit.errors?.name} />}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="is_active">Status<span className="text-red-500">*</span></Label>
                  <div>
                    <Select value={isActive} onValueChange={(val) => setIsActive(val)} name="is_active">
                      <SelectTrigger id="is_active" className="w-full">
                        <SelectValue placeholder="Select status product" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="true">Active</SelectItem>
                          <SelectItem value="false">Inactive</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {stateFormAddEdit.errors?.is_active && <ZodErrors err={stateFormAddEdit.errors?.is_active} />}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label onClick={() => openPopoverCategory(true)} className="gap-0">Category<span className="text-red-500">*</span></Label>
                  <div>
                    <Popover open={openSelectCategory} onOpenChange={openPopoverCategory}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSelectCategory}
                          className="w-full justify-between"
                          style={{ fontWeight: "normal" }}
                        >
                          {(datasCategory && valueSelectCategory) ? datasCategory.find((x) => x.id.toString() === valueSelectCategory)?.name
                            : <span className="font-normal text-muted-foreground">Select product category</span>}
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                        <Command shouldFilter={false}>
                          <CommandInput value={inputSearchCategory} onValueChange={(val) => {
                            onChangeSearchPovCategory(val);
                          }} placeholder="Search categories..." className="h-8" />
                          <CommandList>
                            <CommandEmpty>No category found.</CommandEmpty>
                            <CommandGroup>
                              {datasCategory && datasCategory.map((x) => (
                                <CommandItem
                                  key={x.id}
                                  value={x.id.toString()}
                                  onSelect={(currentValue) => {
                                    setValueSelectCategory(currentValue === valueSelectCategory ? "" : currentValue)
                                    setOpenSelectCategory(false)
                                  }}
                                >
                                  {x.name}
                                  <Check
                                    className={`ml-auto ${valueSelectCategory === x.id.toString() ? "opacity-100" : "opacity-0"}`}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    {stateFormAddEdit.errors?.category && <ZodErrors err={stateFormAddEdit.errors?.category} />}
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="brand">Brand</Label>
                  <div>
                    <Input value={txtBrand} onChange={(e) => setTxtBrand(e.target.value)} type="text" id="brand" name="brand" placeholder="Enter product brand" />
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="uom">Measurement(UOM)</Label>
                  <div>
                    <Popover open={openSelectUom} onOpenChange={setOpenSelectUom}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openSelectUom}
                          className="w-full justify-between"
                          style={{ fontWeight: "normal" }}
                        >
                          {valueSelectUom ? Configs.measurement.find((x) => x.name === valueSelectUom)?.name
                            : <span className="font-normal text-muted-foreground">Select product uom</span>}
                          <ChevronDown className="opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="p-0 w-[var(--radix-popover-trigger-width)]" align="start">
                        <Command>
                          <CommandInput placeholder="Search product uom..." className="h-8" />
                          <CommandList>
                            <CommandEmpty>No measurement found.</CommandEmpty>
                            <CommandGroup>
                              {
                                Configs.measurement.map((x, i) => (
                                  <CommandItem
                                    key={i}
                                    value={x.name}
                                    onSelect={(currentValue) => {
                                      setValueSelectUom(currentValue === valueSelectUom ? "" : currentValue)
                                      setOpenSelectUom(false)
                                    }}
                                  >
                                    {x.name}
                                    <Check
                                      className={`ml-auto ${valueSelectUom === x.name ? "opacity-100" : "opacity-0"}`}
                                    />
                                  </CommandItem>
                                ))
                              }
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="store_desc">Short Description</Label>
                  <div>
                    <Input value={txtShortDesc} onChange={(e) => setTxtShortDesc(e.target.value)} type="text" id="store_desc" name="store_desc" placeholder="Enter description if any" />
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="picture_type">Picture Type</Label>
                  <div>
                    <Select name="picture_type">
                      <SelectTrigger id="picture_type" className="w-full">
                        <SelectValue placeholder="Select picture type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="file">Upload File</SelectItem>
                          <SelectItem value="url">URL</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                  <Label className="gap-0" htmlFor="picture">Picture</Label>
                  <div>
                    <Input type="text" id="picture" name="picture" placeholder="Enter product code" />
                  </div>
                </div>
                <div className="col-span-12 grid gap-2 mb-1">
                  <Label className="gap-0">Description</Label>
                  <Tiptap content={txtDesc} setContent={setTxtDesc} placeholder="Enter product description if any" className="h-24" />
                </div>

                <div className="col-span-12 grid gap-2">
                  <hr />
                  <div>
                    <Label className="gap-0">Product Variant<span className="text-red-500">*</span></Label>
                    <p className="text-muted-foreground text-sm">Here you can enter the variant of the product (Minimal 1)</p>
                  </div>
                  <div className="grid gap-2">
                    <TableTopToolbar
                      inputSearch={inputSearchVariant}
                      thColomn={tblThColomnsVariant}
                      setTblThColomns={setTblThColomnsVariant}
                      setInputSearch={setInputSearchVariant}
                      fatchData={() => fatchDatasVariant(pageTableVariant)}

                      openModal={addEditId != null ? () => openModalAddEditVariant() : undefined}
                    />

                    <div className="overflow-hidden rounded-lg border">
                      <Table>
                        <TableHeader className="bg-muted sticky top-0 z-10">
                          <TableRow>
                            <TableHead>#</TableHead>
                            {
                              tblThColomnsVariant.map((x, i) => {
                                if (x.IsVisible) return <TableHead key={x.key}>{x.name}</TableHead>
                              })
                            }
                            <TableHead className="text-right">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {
                            datasVariant != null && datasVariant?.length > 0 ? datasVariant.map((data, i) => (
                              <TableRow key={data.id}>
                                <TableCell>{(pageTable - 1) * perPage + i + 1}</TableCell>
                                {
                                  'sku' in data && <TableCell>
                                    <Badge className="primary">
                                      <div className="truncate max-w-[150px]">
                                        {data.sku}
                                      </div>
                                    </Badge>
                                  </TableCell>
                                }
                                {'name' in data && <TableCell className="truncate max-w-[160px]">{data.name}</TableCell>}
                                {'barcode' in data && <TableCell>{data.barcode}</TableCell>}
                                {'price' in data && <TableCell>{data.price.toString()}</TableCell>}
                                {'stock_qty' in data && <TableCell>{data.stock_qty}</TableCell>}
                                {'is_active' in data && (
                                  <TableCell>
                                    <div className={`${data.is_active === true ? "text-green-600" : "text-red-600"} font-semibold`}>
                                      {data.is_active === true ? "Active" : "Inactive"}
                                    </div>
                                  </TableCell>
                                )}

                                <TableCell className="text-right space-x-1">
                                  <i className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                                  <i className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
                                </TableCell>
                              </TableRow>
                            )) : <TableRow>
                              <TableCell className="text-center" colSpan={tblThColomnsVariant.length + 3}><i>No data found!</i></TableCell>
                            </TableRow>
                          }
                        </TableBody>
                      </Table>
                    </div>

                    <TablePagination
                      perPage={perPageVariant}
                      pageTable={pageTableVariant}
                      totalPage={totalPageVariant}
                      totalCount={totalCountVariant}
                      setPerPage={setPerPageVariant}
                      setPageTable={setPageTableVariant}
                      fatchData={fatchDatasVariant}

                      inputPage={inputPageVariant}
                      setInputPage={setInputPageVariant}
                    />
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="p-4 pt-0 mt-3">
              <Button type="submit" className="primary" size={'sm'} formNoValidate>Submit</Button>
              <Button type="button" onClick={() => closeModalAddEdit()} variant={'outline'} size={'sm'}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>


      <Dialog open={openModalVariant} onOpenChange={setOpenModalVariant} modal={false}>
        <DialogContent className="p-4 text-sm sm:max-w-lg" setOpenModal={() => setOpenModalVariant(false)} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base"><i className='bx bx-basket text-lg'></i> {addEditId ? "Edit" : "Add"} Product Variant</DialogTitle>
            <DialogDescription>Here form to handle product variant data</DialogDescription>
          </DialogHeader>
          <form>


            <DialogFooter>
              <Button type="submit" className="primary" size={'sm'}>Submit</Button>
              <Button type="button" onClick={() => setOpenModalVariant(false)} variant={'outline'} size={'sm'}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
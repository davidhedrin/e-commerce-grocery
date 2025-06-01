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
import { GetDataProduct, GetDataProductCategory } from "@/server/product";
import { Product, ProductCategory } from "@prisma/client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";

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
  const [txtDesc, setTxtDesc] = useState("");
  const [valueSelectCategory, setValueSelectCategory] = useState("");
  const [valueSelectUom, setValueSelectUom] = useState("");
  const FormSchemaAddEdit = z.object({
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    name: z.string().min(1, { message: 'Name is required field.' }).trim(),
    slug: z.string().min(1, { message: 'Slug is required field.' }).trim(),
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
        <DialogContent className="p-4 text-sm sm:max-w-2xl" setOpenModal={() => closeModalAddEdit()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base"><i className='bx bx-package text-lg'></i> {addEditId ? "Edit" : "Add"} Product</DialogTitle>
            <DialogDescription>Here form to handle product data</DialogDescription>
          </DialogHeader>
          <form action={(formData) => handleFormSubmitAddEdit(formData)}>
            <div className='grid grid-cols-12 gap-3 mb-3'>
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
                </div>
              </div>
              <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
                <Label className="gap-0" htmlFor="brand">Brand</Label>
                <div>
                  <Input type="text" id="brand" name="brand" placeholder="Enter product brand" />
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
              {/* <div className="col-span-12 sm:col-span-6 md:col-span-4 grid gap-2">
              </div> */}
              <div className="col-span-12 grid gap-2">
                <Label className="gap-0" htmlFor="store_desc">Short Description</Label>
                <Textarea value={txtShortDesc} onChange={(e) => setTxtShortDesc(e.target.value)} id="store_desc" name="store_desc" className="min-h-9" placeholder="Enter description if any" />
              </div>
              <div className="col-span-12 grid gap-2">
                <Label className="gap-0">Description</Label>
                <Tiptap content={txtDesc} setContent={setTxtDesc} placeholder="Enter description if any" />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="primary" size={'sm'}>Submit</Button>
              <Button type="button" onClick={() => closeModalAddEdit()} variant={'outline'} size={'sm'}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
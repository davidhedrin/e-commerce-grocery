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
import { ZodErrors } from "@/components/zod-errors";
import Configs from "@/lib/config";
import { FormState, TableShortList, TableThModel } from "@/lib/models-type";
import { formatDate, formatToIDR, inputFormatPriceIdr, normalizeSelectObj, parseFromIDR, pictureTypeLabels, removeListStateByIndex, SonnerPromise, sortListToOrderBy } from "@/lib/utils";
import { GetDataProduct, GetDataProductById, GetDataProductCategory, GetDataProductVariant, StoreUpdateDataProduct } from "@/server/product";
import { PictureTypeEnum, Product, ProductCategory, ProductVariant } from "@prisma/client";
import { Check, ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { z } from "zod";
import { ScrollArea } from "@/components/ui/scroll-area";
import { DtoProduct, DtoProductVariant } from "@/lib/dto";
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

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
  const [txtName, setTxtName] = useState("");
  const [txtShortDesc, setTxtShortDesc] = useState("");
  const [txtDesc, setTxtDesc] = useState<string | undefined>();
  const [valueSelectCategory, setValueSelectCategory] = useState("");
  const [valueSelectUom, setValueSelectUom] = useState("");
  const [txtBrand, setTxtBrand] = useState("");
  const [txtPictureType, setTxtPictureType] = useState<PictureTypeEnum | undefined>();
  const [filePictureProduct, setFilePictureProduct] = useState<File | null>(null);
  const [urlPictureProduct, setUrlPictureProduct] = useState("");
  const [urlPictureProductPrev, setUrlPictureProductPrev] = useState<string>();
  const [listVariant, setListVariant] = useState<DtoProductVariant[]>([]);
  const onChangePictureType = (type: PictureTypeEnum) => {
    setFilePictureProduct(null);
    setUrlPictureProduct("");
    setTxtPictureType(type);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;

      const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
      const maxSizeInMB = Configs.maxSizePictureInMB;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.warning("Invalid File Type!", {
          description: "Only JPG, JPEG, or PNG files are allowed.",
        });
        e.target.value = "";
        return;
      };
      if (file.size > maxSizeInBytes) {
        toast.warning("File Too Large!", {
          description: `The file size must be less than ${maxSizeInMB}MB.`,
        });
        e.target.value = "";
        return;
      };

      const objectUrl = URL.createObjectURL(file);
      setUrlPictureProductPrev(objectUrl);
      setFilePictureProduct(file);
    } else {
      setUrlPictureProductPrev(undefined);
      setFilePictureProduct(null);
    }
  };
  const handleRemoveImageProduct = () => {
    setUrlPictureProductPrev(undefined);
    setFilePictureProduct(null);
  };
  const FormSchemaAddEdit = z.object({
    is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    name: z.string().min(1, { message: 'Name is required field.' }).trim(),
    slug: z.string().min(1, { message: 'Slug is required field.' }).trim(),
    category: z.string().min(1, { message: 'Category is required field.' }).trim(),
    picture_type: z.string().min(1, { message: 'Picture type is required field.' }).trim(),
    list_variant: z.array(z.string()).min(1, { message: 'At least one product variant is required.' })
  });
  const closeModalAddEdit = () => {
    setStateFormAddEdit({ success: true, errors: {} });
    setOpenModal(false);
    setOpenModalVariant(false);
  };
  const createDtoData = (): DtoProduct => {
    const newData: DtoProduct = {
      id: addEditId,
      name: txtName,
      desc: txtDesc || null,
      short_desc: txtShortDesc.trim() != "" ? txtShortDesc : null,
      category_id: parseInt(valueSelectCategory),
      brand: txtBrand.trim() != "" ? txtBrand : null,
      uom: valueSelectUom,
      img_type: txtPictureType as PictureTypeEnum,
      img_url: urlPictureProduct.trim() != "" ? urlPictureProduct : null,
      file_img: filePictureProduct,
      is_active: isActive === "true" ? true : false,
    };
    return newData;
  };
  const openModalAddEdit = async (id?: number) => {
    if (id) {
      const openSonner = SonnerPromise("Loading open form...");
      const data = await GetDataProductById(id);
      if (data) {
        setAddEditId(data.id);
        setIsActive(data.is_active != null ? data.is_active.toString() : undefined);
        setTxtName(data.name);
        setTxtShortDesc(data.short_desc || "");
        setTxtDesc(data.desc || undefined);
        setValueSelectCategory(data.category_id ? data.category_id.toString() : "");
        setValueSelectUom(data.uom || "");
        setTxtBrand(data.brand || "");
        setTxtPictureType(data.img_type || undefined);
        setFilePictureProduct(null);
        setUrlPictureProduct(data.img || "");

        const variants = data.variants.map(x => {
          const dtoData: DtoProductVariant = {
            id: x.id,
            product_id: data.id,
            sku: x.sku,
            barcode: x.barcode,
            name: x.name,
            price: x.price,
            disc_price: x.disc_price != null ? x.disc_price : null,
            desc: x.desc,
            img_type: x.img_type,
            img_url: x.img,
            file_img: null,
            is_active: x.is_active
          };
          return dtoData;
        })
        setListVariant(variants);
      }
      toast.dismiss(openSonner);
    } else {
      setAddEditId(null);
      setIsActive(undefined);
      setTxtName("");
      setTxtShortDesc("");
      setTxtDesc(undefined);
      setValueSelectCategory("");
      setValueSelectUom("");
      setTxtBrand("");
      setTxtPictureType(PictureTypeEnum.FILE);
      setFilePictureProduct(null);
      setUrlPictureProduct("");
      setListVariant([]);
    }
    setOpenModal(true);
  };
  const handleFormSubmitAddEdit = async (formData: FormData) => {
    formData.append("category", valueSelectCategory);
    formData.append("picture_file", filePictureProduct?.name || "");
    formData.append("picture_url", urlPictureProduct);
    formData.append("list_variant", JSON.stringify(listVariant.map(x => x.name)));

    let formSchame = FormSchemaAddEdit;
    if (txtPictureType === PictureTypeEnum.FILE) {
      const newFormSchame = FormSchemaAddEdit.extend({
        picture_file: z.string().min(1, { message: 'Picture file is required field.' }).trim()
      });
      formSchame = newFormSchame;
    } else if (txtPictureType === PictureTypeEnum.URL) {
      const newFormSchame = FormSchemaAddEdit.extend({
        picture_url: z.string().min(1, { message: 'Image url is required field.' }).trim()
      });
      formSchame = newFormSchame;
    };

    const data = Object.fromEntries(formData);
    if (data.list_variant) data.list_variant = JSON.parse(data.list_variant as string);
    const valResult = formSchame.safeParse(data);
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
        await StoreUpdateDataProduct(createDtoData());
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

  // Product variant
  const [openModalVariant, setOpenModalVariant] = useState(false);
  const [stateFormAddEditVar, setStateFormAddEditVar] = useState<FormState>({ success: false, errors: {} });
  const [editSelectIndexVar, setEditSelectIndexVar] = useState<number | null>(null);
  const [addEditIdVar, setAddEditIdVar] = useState<number | null>(null);
  const [isActiveVar, setIsActiveVar] = useState<string>();
  const [txtNameVar, setTxtNameVar] = useState("");
  const [txtSkuVar, setTxtSkuVar] = useState("");
  const [txtBarcodeVar, setTxtBarcodeVar] = useState("");
  const [txtPriceVar, setTxtPriceVar] = useState("");
  const [txtDiscPriceVar, setTxtDiscPriceVar] = useState("");
  const [txtPictureTypeVar, setTxtPictureTypeVar] = useState<PictureTypeEnum | null>(null);
  const [filePictureProductVar, setFilePictureProductVar] = useState<File | null>(null);
  const [urlPictureProductVar, setUrlPictureProductVar] = useState("");
  const [urlPictureProductVarPrev, setUrlPictureProductVarPrev] = useState<string>();
  const [txtDescVar, setTxtDescVar] = useState("");
  const onChangePictureTypeVar = (type: PictureTypeEnum) => {
    setFilePictureProductVar(null);
    setUrlPictureProductVar("");
    setTxtPictureTypeVar(type);
  };
  const handleFileChangeVar = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file = e.target.files[0];
      if (!file) return;

      const allowedTypes = ["image/jpg", "image/jpeg", "image/png"];
      const maxSizeInMB = Configs.maxSizePictureInMB;
      const maxSizeInBytes = maxSizeInMB * 1024 * 1024;

      if (!allowedTypes.includes(file.type)) {
        toast.warning("Invalid File Type!", {
          description: "Only JPG, JPEG, or PNG files are allowed.",
        });
        e.target.value = "";
        return;
      };
      if (file.size > maxSizeInBytes) {
        toast.warning("File Too Large!", {
          description: `The file size must be less than ${maxSizeInMB}MB.`,
        });
        e.target.value = "";
        return;
      };

      const objectUrl = URL.createObjectURL(file);
      setUrlPictureProductVarPrev(objectUrl);
      setFilePictureProductVar(file);
    } else {
      setUrlPictureProductVarPrev(undefined);
      setFilePictureProductVar(null);
    }
  };
  const createDtoDataVar = (): DtoProductVariant => {
    const newData: DtoProductVariant = {
      id: addEditIdVar,
      product_id: addEditId,
      sku: txtSkuVar,
      barcode: txtBarcodeVar,
      name: txtNameVar,
      price: parseFromIDR(txtPriceVar),
      disc_price: parseFromIDR(txtDiscPriceVar),
      desc: txtDescVar,
      img_type: txtPictureTypeVar as PictureTypeEnum,
      img_url: urlPictureProductVar.trim() != "" ? urlPictureProductVar : null,
      file_img: filePictureProductVar,
      is_active: isActiveVar === "true" ? true : false,
    };

    if(txtPictureTypeVar === PictureTypeEnum.FILE && filePictureProductVar != undefined) newData.img_url = URL.createObjectURL(filePictureProductVar);
    return newData;
  };
  const openModalAddEditVariant = async (idx?: number) => {
    if (idx !== undefined) {
      const findData: DtoProductVariant = listVariant[idx];
      setEditSelectIndexVar(idx);
      setAddEditIdVar(findData.id || null);
      setIsActiveVar(findData.is_active != null ? findData.is_active.toString() : undefined);
      setTxtNameVar(findData.name || "");
      setTxtSkuVar(findData.sku || "");
      setTxtBarcodeVar(findData.barcode || "");
      setTxtPriceVar(findData.price ? formatToIDR(findData.price) : "");
      setTxtDiscPriceVar(findData.disc_price ? formatToIDR(findData.disc_price) : "");
      setTxtDescVar(findData.desc || "");
      setTxtPictureTypeVar(findData.img_type);
      if (findData.img_type !== undefined) {
        if (findData.img_type === PictureTypeEnum.FILE) {
          setUrlPictureProductVar("");
          if(findData.file_img != null && findData.file_img !== undefined) {
            setUrlPictureProductVarPrev(URL.createObjectURL(findData.file_img));
            setFilePictureProductVar(findData.file_img);
          }
          else {
            setUrlPictureProductVarPrev(undefined);
            setFilePictureProductVar(null);
          }
        } else if (findData.img_type === PictureTypeEnum.URL) {
          setUrlPictureProductVar(findData.img_url || "");
          setUrlPictureProductVarPrev(undefined);
          setFilePictureProductVar(null);
        }
      }
    } else {
      setEditSelectIndexVar(null);
      setAddEditIdVar(null);
      setIsActiveVar(undefined);
      setTxtNameVar("");
      setTxtSkuVar("");
      setTxtBarcodeVar("");
      setTxtPriceVar("");
      setTxtDiscPriceVar("");
      setTxtPictureTypeVar(null);
      setFilePictureProductVar(null);
      setUrlPictureProductVar("");
      setUrlPictureProductVarPrev(undefined);
      setTxtDescVar("");
    }
    setOpenModalVariant(true);
  };
  const closeModalAddEditVariant = () => {
    setStateFormAddEditVar({ success: true, errors: {} });
    setOpenModalVariant(false);
  };
  const handleRemoveImageProductVar = () => {
    setUrlPictureProductVarPrev(undefined);
    setFilePictureProductVar(null);
  };
  const FormSchemaAddEditVar = z.object({
    var_is_active: z.string().min(1, { message: 'Status is required field.' }).trim(),
    var_name: z.string().min(1, { message: 'Name is required field.' }).trim(),
    var_sku: z.string().min(1, { message: 'SKU is required field.' }).trim(),
    var_price: z.string().min(1, { message: 'Price is required field.' }).trim()
  });
  const handleFormSubmitAddEditVariant = (formData: FormData) => {
    const submitClose = formData.get("submitClose");

    const data = Object.fromEntries(formData);
    const valResult = FormSchemaAddEditVar.safeParse(data);
    if (!valResult.success) {
      setStateFormAddEditVar({
        success: false,
        errors: valResult.error.flatten().fieldErrors,
      });
      return;
    };
    setStateFormAddEditVar({ success: true, errors: {} });

    const dataVar: DtoProductVariant = createDtoDataVar();
    if(editSelectIndexVar != null) {
      setListVariant(prev => {
      const newList = [...prev];
      newList[editSelectIndexVar] = {
        id: dataVar.id,
        product_id: addEditId,
        sku: dataVar.sku,
        barcode: dataVar.barcode,
        name: dataVar.name,
        price: dataVar.price,
        disc_price: dataVar.disc_price,
        desc: dataVar.desc,
        img_type: dataVar.img_type,
        img_url: dataVar.img_url,
        file_img: dataVar.file_img,
        is_active: dataVar.is_active,
      };
      return newList;
    });
    }else{
      setListVariant(prev => [...prev, dataVar]);
    }

    if (submitClose === "close") closeModalAddEditVariant();
  }
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
                    <i onClick={() => openModalAddEdit(data.id)} className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
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
                  <Label className="gap-0">Measurement(UOM)</Label>
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
                  <Label className="gap-0" htmlFor="picture_type">Picture Type<span className="text-red-500">*</span></Label>
                  <div>
                    <Select defaultValue={txtPictureType} onValueChange={(val) => onChangePictureType(val as PictureTypeEnum)} name="picture_type">
                      <SelectTrigger id="picture_type" className="w-full">
                        <SelectValue placeholder="Select picture type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {
                            Object.values(PictureTypeEnum).map((x, i) => (
                              <SelectItem key={i} value={x}>{pictureTypeLabels[x]}</SelectItem>
                            ))
                          }
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                    {stateFormAddEdit.errors?.picture_type && <ZodErrors err={stateFormAddEdit.errors?.picture_type} />}
                  </div>
                </div>
                {
                  txtPictureType && (
                    <div className="col-span-12 mb-1">
                      <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${txtPictureType === PictureTypeEnum.FILE ? "" : "hidden"}`}>
                        <div className="flex justify-center items-center">
                          {!filePictureProduct ? (
                            <Label htmlFor="picture_file" className="gap-1 w-full h-28 cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center">
                              <i className="bx bx-image-add text-2xl"></i>
                              <div>
                                Choose Image<span className="text-red-500">*</span>
                              </div>
                              <p className="font-normal italic">Click here to select file</p>
                              {stateFormAddEdit.errors?.picture_file && <ZodErrors err={stateFormAddEdit.errors?.picture_file} />}
                            </Label>
                          ) : (
                            urlPictureProductPrev ? (
                              <div className="relative w-full h-28">
                                <img
                                  src={urlPictureProductPrev}
                                  alt="Selected"
                                  className="w-full h-28 object-cover rounded-lg border-2 border-dashed border-gray-600"
                                />
                                <Button
                                  type="button"
                                  variant={"destructive"}
                                  className="cursor-pointer absolute top-2 right-2 rounded-full px-1 h-6"
                                  onClick={handleRemoveImageProduct}
                                >
                                  <i className="bx bx-x"></i>
                                </Button>
                              </div>
                            ) : <Label htmlFor="picture_file" className="gap-1 w-full h-28 cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center">
                              <i className="bx bx-image-add text-2xl"></i>
                              <div>
                                Choose Image<span className="text-red-500">*</span>
                              </div>
                              <p className="font-normal italic">Click here to select file</p>
                              {stateFormAddEdit.errors?.picture_file && <ZodErrors err={stateFormAddEdit.errors?.picture_file} />}
                            </Label>
                          )}
                          <div>
                            <Input onChange={handleFileChange} type="file" id="picture_file" name="picture_file" className="hidden" />
                          </div>
                        </div>

                        <div className="flex flex-col justify-start items-start md:justify-center md:items-start">
                          <div className="font-semibold">Upload File - Terms & Conditions:</div>
                          <ul className="list-disc pl-5 text-sm w-auto">
                            <li>Allowed formats<span className="text-red-500">*</span>: JPG, JPEG, PNG.</li>
                            <li>Maximum file size<span className="text-red-500">*</span>: {Configs.maxSizePictureInMB}MB.</li>
                            <li>Image is clear and not blurry.</li>
                            <li>Ensure product image is not watermarked.</li>
                          </ul>
                        </div>
                      </div>

                      <div className={`grid gap-2 ${txtPictureType === PictureTypeEnum.URL ? "" : "hidden"}`}>
                        <Label className="gap-0" htmlFor="picture_url">Picture URL<span className="text-red-500">*</span></Label>
                        <div>
                          <Input
                            value={urlPictureProduct ?? ""}
                            onChange={(e) => setUrlPictureProduct(e.target.value)}
                            type="text"
                            id="picture_url"
                            name="picture_url"
                            placeholder="Enter picture url product"
                          />
                          {stateFormAddEdit.errors?.picture_url && <ZodErrors err={stateFormAddEdit.errors?.picture_url} />}
                        </div>
                      </div>
                    </div>
                  )
                }
                <div className="col-span-12 grid gap-2">
                  <Label className="gap-0" htmlFor="description">Short Description</Label>
                  <div>
                    <Input value={txtShortDesc} onChange={(e) => setTxtShortDesc(e.target.value)} type="text" id="description" name="description" placeholder="Enter description if any" />
                  </div>
                </div>
                <div className="col-span-12 grid gap-2">
                  <Label className="gap-0">Description</Label>
                  <Tiptap content={txtDesc || ""} setContent={setTxtDesc} placeholder="Enter product description if any" className="min-h-24" />
                </div>

                <div className="col-span-12 grid gap-2">
                  <hr />
                  <div>
                    <Label className="gap-0">Product Variant (Min 1<span className="text-red-500">*</span>)</Label>
                    <p className="text-muted-foreground text-sm mb-0">Here you can enter the variant of product, And manage stock items from the Inventory menu.</p>
                    {stateFormAddEdit.errors?.list_variant && <ZodErrors err={stateFormAddEdit.errors?.list_variant} />}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-stretch">
                    {
                      listVariant.map((x, i) => (
                        <Card key={i} className="p-3 relative flex flex-col justify-between gap-0">
                          <CardHeader className="p-0 gap-1">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle className="text-lg font-normal">{x.name}</CardTitle>
                                <CardDescription>SKU: {x.sku}</CardDescription>
                              </div>
                              <CardAction>
                                <i onClick={() => openModalAddEditVariant(i)} className='bx bx-edit text-lg text-amber-500 cursor-pointer'></i>
                                <i onClick={() => setListVariant(removeListStateByIndex(listVariant, i))} className='bx bx-trash text-lg text-red-600 cursor-pointer'></i>
                              </CardAction>
                            </div>
                          </CardHeader>

                          <CardFooter className="relative flex flex-col items-start text-sm p-0">
                            <div className="font-medium">Price: Rp {formatToIDR(x.price)}</div>
                            <div className="text-muted-foreground">Discount: Rp {x.disc_price ? formatToIDR(x.disc_price) : "-"}</div>

                            {x.img_url && (
                              <div className="absolute bottom-0 right-0 w-20 h-full rounded-md overflow-hidden border">
                                <img
                                  src={x.img_url}
                                  alt={x.name || "Variant"}
                                  className="object-cover w-full h-full"
                                />
                              </div>
                            )}
                          </CardFooter>
                        </Card>
                      ))
                    }

                    <div
                      onClick={() => openModalAddEditVariant()}
                      className="gap-1 w-full h-full min-h-28 cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center"
                    >
                      <i className="bx bx-layer-plus text-2xl"></i>
                      <div>Add Variant</div>
                      <p className="font-normal italic">Click to add new variant</p>
                    </div>
                  </div>
                </div>
              </div>
            </ScrollArea>

            <DialogFooter className="p-4 pt-0 mt-3">
              <Button type="submit" className="primary" size={'sm'} formNoValidate>Submit</Button>
              <Button type="button" onClick={() => closeModalAddEdit()} variant={"outline"} size={'sm'}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={openModalVariant} onOpenChange={setOpenModalVariant} modal={false}>
        <DialogContent className="p-4 text-sm sm:max-w-lg" setOpenModal={() => closeModalAddEditVariant()} onEscapeKeyDown={(e) => e.preventDefault()} onInteractOutside={(e) => e.preventDefault()}>
          <DialogHeader className="justify-center gap-y-0">
            <DialogTitle className="text-base"><i className='bx bx-layer-plus text-lg'></i> {addEditId ? "Edit" : "Add"} Product Variant</DialogTitle>
            <DialogDescription>Here form to handle product variant data</DialogDescription>
          </DialogHeader>
          <form action={(formData) => handleFormSubmitAddEditVariant(formData)}>
            <div className='grid grid-cols-12 gap-3 mb-0 py-4 pt-0'>
              <div className="col-span-12 md:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="var_name">Name<span className="text-red-500">*</span></Label>
                <div>
                  <Input value={txtNameVar} onChange={(e) => setTxtNameVar(e.target.value)} type="text" id="var_name" name="var_name" placeholder="Enter variant name" />
                  {stateFormAddEditVar.errors?.var_name && <ZodErrors err={stateFormAddEditVar.errors?.var_name} />}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="var_is_active">Status<span className="text-red-500">*</span></Label>
                <div>
                  <Select value={isActiveVar} onValueChange={(val) => setIsActiveVar(val)} name="var_is_active">
                    <SelectTrigger id="var_is_active" className="w-full">
                      <SelectValue placeholder="Select status variant" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="true">Active</SelectItem>
                        <SelectItem value="false">Inactive</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  {stateFormAddEditVar.errors?.var_is_active && <ZodErrors err={stateFormAddEditVar.errors?.var_is_active} />}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="var_sku">SKU<span className="text-red-500">*</span></Label>
                <div>
                  <Input value={txtSkuVar} onChange={(e) => setTxtSkuVar(e.target.value)} type="text" id="var_sku" name="var_sku" placeholder="Enter variant sku" />
                  {stateFormAddEditVar.errors?.var_sku && <ZodErrors err={stateFormAddEditVar.errors?.var_sku} />}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="var_price">Price<span className="text-red-500">*</span></Label>
                <div>
                  <Input value={txtPriceVar} onChange={(e) => setTxtPriceVar(inputFormatPriceIdr(e.target.value) || "")} type="text" id="var_price" name="var_price" placeholder="Enter variant price (IDR)" />
                  {stateFormAddEditVar.errors?.var_price && <ZodErrors err={stateFormAddEditVar.errors?.var_price} />}
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="var_barcode">Barcode</Label>
                <div>
                  <Input value={txtBarcodeVar} onChange={(e) => setTxtBarcodeVar(e.target.value)} type="text" id="var_barcode" name="var_barcode" placeholder="Enter variant barcode" />
                </div>
              </div>
              <div className="col-span-12 md:col-span-6 grid gap-2">
                <Label className="gap-0" htmlFor="var_disc_price">Discount Price</Label>
                <div>
                  <Input value={txtDiscPriceVar} onChange={(e) => setTxtDiscPriceVar(inputFormatPriceIdr(e.target.value) || "")} type="text" id="var_disc_price" name="var_disc_price" placeholder="Enter variant discount (IDR)" />
                </div>
              </div>
              <div className="col-span-12 grid gap-2">
                <Label className="gap-0" htmlFor="var_picture_type">Picture Type</Label>
                <div>
                  <Select defaultValue={txtPictureTypeVar || undefined} onValueChange={(val) => onChangePictureTypeVar(val as PictureTypeEnum)} name="var_picture_type">
                    <SelectTrigger id="var_picture_type" className="w-full">
                      <SelectValue placeholder="Select variant picture type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {
                          Object.values(PictureTypeEnum).map((x, i) => (
                            <SelectItem key={i} value={x}>{pictureTypeLabels[x]}</SelectItem>
                          ))
                        }
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              {
                txtPictureTypeVar && (
                  <div className="col-span-12 mb-1">
                    <div className={`grid grid-cols-1 md:grid-cols-2 gap-3 ${txtPictureTypeVar === PictureTypeEnum.FILE ? "" : "hidden"}`}>
                      <div className="flex justify-center items-center">
                        {
                          urlPictureProductVarPrev ? (
                            <div className="relative w-full h-28">
                              <img
                                src={urlPictureProductVarPrev}
                                alt="Selected"
                                className="w-full h-28 object-cover rounded-lg border-2 border-dashed border-gray-600"
                              />
                              <Button
                                type="button"
                                variant={"destructive"}
                                className="cursor-pointer absolute top-2 right-2 rounded-full px-1 h-6"
                                onClick={handleRemoveImageProductVar}
                              >
                                <i className="bx bx-x"></i>
                              </Button>
                            </div>
                          ) : <Label htmlFor="var_picture_file" className="gap-1 w-full h-28 cursor-pointer border-2 border-dashed border-gray-400 rounded-lg flex flex-col justify-center items-center">
                            <i className="bx bx-image-add text-2xl"></i>
                            <div>
                              Choose Image
                            </div>
                            <p className="font-normal italic">Click here to select file</p>
                          </Label>
                        }
                        <div>
                          <Input onChange={handleFileChangeVar} type="file" id="var_picture_file" name="var_picture_file" className="hidden" />
                        </div>
                      </div>

                      <div className="flex flex-col justify-start items-start md:justify-center md:items-start">
                        <div className="font-semibold">Upload File - Terms & Conditions:</div>
                        <ul className="list-disc pl-5 text-sm w-auto">
                          <li>Allowed formats<span className="text-red-500">*</span>: JPG, JPEG, PNG.</li>
                          <li>Maximum file size<span className="text-red-500">*</span>: {Configs.maxSizePictureInMB}MB.</li>
                          <li>Image is clear and not blurry.</li>
                          <li>Image is not watermarked.</li>
                        </ul>
                      </div>
                    </div>

                    <div className={`grid gap-2 ${txtPictureTypeVar === PictureTypeEnum.URL ? "" : "hidden"}`}>
                      <Label className="gap-0" htmlFor="var_picture_url">Picture URL</Label>
                      <div>
                        <Input
                          value={urlPictureProductVar ?? ""}
                          onChange={(e) => setUrlPictureProductVar(e.target.value)}
                          type="text"
                          id="var_picture_url"
                          name="var_picture_url"
                          placeholder="Enter picture url product"
                        />
                      </div>
                    </div>
                  </div>
                )
              }
              <div className="col-span-12 grid gap-2">
                <Label className="gap-0" htmlFor="var_desc">Description</Label>
                <div>
                  <Input value={txtDescVar} onChange={(e) => setTxtDescVar(e.target.value)} type="text" id="var_desc" name="var_desc" placeholder="Enter description if any" />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" className="primary" size={'sm'}>Save</Button>
              <Button type="submit" variant={"outline"} size={'sm'} name="submitClose" value="close">Save & Close</Button>
              <Button type="button" onClick={() => closeModalAddEditVariant()} variant={'ghost'} size={'sm'}>Cancel</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  )
}
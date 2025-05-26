import BreadcrumbListing from "@/components/breadcrumb-list";

export default function Page() {
  const listBreadcrumb = [
    { name: "Warehouse" },
    { name: "Product", url: "/product" }
  ];

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />
    </>
  )
}
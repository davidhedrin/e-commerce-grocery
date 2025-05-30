"use client";

import BreadcrumbListing from "@/components/breadcrumb-list";
import { useLoading } from "@/components/loading-context";
import { useEffect } from "react";

export default function Page() {
  const { setLoading } = useLoading();
  const listBreadcrumb = [
    { name: "Warehouse" },
    { name: "Product", url: "/product" }
  ];

  useEffect(() => {
    const firstInit = async () => {
      setLoading(false);
    };
    firstInit();
  }, []);

  return (
    <>
      <BreadcrumbListing listBc={listBreadcrumb} />
    </>
  )
}
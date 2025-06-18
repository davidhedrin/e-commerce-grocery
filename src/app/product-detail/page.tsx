"use client";

import { useLoading } from "@/components/loading-context";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ProductDetail() {
  const { setLoading } = useLoading();

  const searchParams = useSearchParams();
  const product_id = searchParams.get('product_id');

  useEffect(() => {
    setLoading(false);
  }, [product_id])
  return (
    <div>
      Product ID:
      {
        product_id
      }
    </div>
  )
}

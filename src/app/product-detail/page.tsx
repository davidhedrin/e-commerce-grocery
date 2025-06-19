"use client";

import { useLoading } from "@/components/loading-context";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Heart, Plus } from "lucide-react";

export default function ProductDetail() {
  const { setLoading } = useLoading();

  const searchParams = useSearchParams();
  const product_id = searchParams.get('product_id');

  useEffect(() => {
    setLoading(false);
  }, [product_id])
  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="relative">
          <img
            src="https://fisherscart.com/cdn/shop/products/greenapple.png?v=1672232680"
            alt="Green Apple Granny Smith"
            className="w-full h-56 md:h-96 md:w-xl object-cover rounded-lg"
          />
          <Badge className="absolute top-2 left-2 bg-red-500 text-white">
            In Stock
          </Badge>
        </div>

        <div className="flex-1 flex flex-col justify-between">
          <div>
            <div className="text-xl font-semibold">Green Apple Granny Smith</div>
            <p className="text-gray-600 mb-2 text-sm">Crisp and tangy green apples.</p>

            <div className="flex items-center gap-4 mb-3">
              <Badge variant={"outline"}>Category: <strong>Fruits</strong></Badge>
              <div className="text-sm text-muted-foreground flex items-center gap-2">
                <span>⭐ 4.2</span><span>•</span><span>12 sold</span>
              </div>
            </div>

            <div className="mb-3">
              <div className="line-through text-muted-foreground">
                Rp 2.000
              </div>
              <span className="text-2xl font-bold text-blue-600">RP 14.990</span>
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium mb-1">Choose Varian:</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" className="rounded-full cursor-pointer px-4">500gr</Button>
                <Button variant="outline" size="sm" className="rounded-full cursor-pointer px-4">1kg</Button>
                <Button variant="outline" size="sm" className="rounded-full cursor-pointer px-4">2kg</Button>
              </div>
            </div>

            <div>
              <p className="text-sm font-medium mb-1">Jumlah:</p>
              <div className="flex items-center border rounded-md w-fit px-1 gap-4">
                <Button variant="ghost" size="icon" className="text-xl cursor-pointer">
                  -
                </Button>
                <span className="min-w-[24px] text-center">1</span>
                <Button variant="ghost" size="icon" className="text-xl cursor-pointer">
                  +
                </Button>
              </div>
            </div>
          </div>
          <div className="flex gap-3">
            <Button className="primary" size={"sm"}><Plus /> Add to Cart</Button>
            <Button variant="outline" size={"sm"}><Heart /> Wishlist</Button>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: product.desc }}
      /> */}

      <section className="prose max-w-none">
        <h1 style={{ textAlign: "center" }}>Green Apple Granny Smith</h1>
        <p style={{ textAlign: "left" }}>
          Apel hijau segar dengan rasa <strong>asam segar</strong> dan
          <em>tekstur renyah</em>, cocok dijadikan camilan sehat atau tambahan salad.
        </p>
        <h2>Keunggulan:</h2>
        <ul>
          <li>Kaya serat dan vitamin C</li>
          <li>Ideal untuk detoksifikasi</li>
          <li>Menjaga kadar gula darah stabil</li>
        </ul>
        <h3>Penggunaan:</h3>
        <ol>
          <li>Langsung dimakan</li>
          <li>Jus apel segar</li>
          <li>Salad buah</li>
        </ol>
      </section>

      <Separator className="my-4" />

      {/* Produk Serupa */}
      <div className="font-bold mb-2 text-muted-foreground">
        Produk Serupa
      </div>

    </div>
  )
}

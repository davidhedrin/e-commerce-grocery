import Link from "next/link"

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { BreadcrumbModel } from "@/lib/models-type"
import React from "react"
import { useLoading } from "./loading-context"

type BreadcrumbListingProps = {
  listBc: BreadcrumbModel[]
}
export default function BreadcrumbListing({ listBc }: BreadcrumbListingProps) {
  const { setLoading } = useLoading();
  return (
    <Breadcrumb className="mb-1">
      <BreadcrumbList>
        {
          listBc.map((x, i) => {
            return <React.Fragment key={i}>
              <BreadcrumbItem>
                <BreadcrumbLink onClick={() => {
                  if(x.url != undefined) setLoading(true)
                }} href={x.url ?? undefined}>
                  {x.name}
                </BreadcrumbLink>
              </BreadcrumbItem>
              {i != listBc.length - 1 && <BreadcrumbSeparator />}
            </React.Fragment>
          })
        }
      </BreadcrumbList>
    </Breadcrumb>
  )
}

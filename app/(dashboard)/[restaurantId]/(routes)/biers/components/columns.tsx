"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type BierColumn = {
  id:           string
  name:         string
  description:  string
  region:       string  
  malt:         string
  style:        string
  color:        string
  formats: {
    name:   string
    price:  string
  }[]
  category:     string
  isFeatured:   boolean
  isArchived:   boolean
  createdAt:    string
}

export const columns: ColumnDef<BierColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "description",
    header: "Description",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "region",
    header: "Region",
  },
  {
    accessorKey: "malt",
    header: "Malt",
  },
  {
    accessorKey: "style",
    header: "Style",
  },
  {
    accessorKey: "color",
    header: "Color",
  },
  {
    accessorKey: "format",
    header: "Price",
    cell: ({ row }) => (
      <div className="flex items-center gap-x-2">
        {row.original.formats.map((item) => (
          <div key={item.name} className="flex-col items-center gap-x-1">
            <div className="text-sm">{item.name}</div>
            <div className="text-sm">{item.price}</div>
          </div>
        ))}
      </div>
    )
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  }
]
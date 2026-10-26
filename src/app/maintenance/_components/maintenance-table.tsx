'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deleteMaintenanceJobAction } from '@/server/actions/maintenance'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableContainer,
} from '@/components/ui/table'
import { formatCurrency, formatDate } from '@/server/utils/formatters'
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from '@tanstack/react-table'
import { ArrowUpDown, Trash2 } from 'lucide-react'

export interface MaintenanceJobRow {
  id: string
  jobDate: Date
  vehicleId: string
  odometerAtService: number
  jobType: 'PREVENTATIVE' | 'BREAKDOWN'
  workshopId?: string | null
  partsCost: number
  labourCost: number
  totalCost: number
  description?: string | null
  vehicle?: {
    id: string
    vehicleNo: string
    makeModel: string
  }
  workshop?: {
    id: string
    name: string
  } | null
}

interface MaintenanceTableProps {
  data: MaintenanceJobRow[]
  total?: number
  page?: number
}

export function MaintenanceTable({ data, total = 0, page = 1 }: MaintenanceTableProps) {
  const router = useRouter()
  const [sorting, setSorting] = useState<SortingState>([])
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const columns: ColumnDef<MaintenanceJobRow>[] = [
    {
      accessorKey: 'jobDate',
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.getValue<Date>('jobDate')),
    },
    {
      accessorKey: 'vehicle.vehicleNo',
      header: 'Vehicle',
      cell: ({ row }) => {
        const vehicle = row.original.vehicle
        return vehicle ? (
          <div>
            <p className="font-medium">{vehicle.vehicleNo}</p>
            <p className="text-xs text-muted-foreground">{vehicle.makeModel}</p>
          </div>
        ) : (
          <span className="text-muted-foreground">-</span>
        )
      },
    },
    {
      accessorKey: 'odometerAtService',
      header: 'Odometer',
      cell: ({ row }) =>
        `${Number(row.getValue<number>('odometerAtService')).toLocaleString('en-IN')} km`,
    },
    {
      accessorKey: 'jobType',
      header: 'Job Type',
      cell: ({ row }) => {
        const jobType = row.getValue<'PREVENTATIVE' | 'BREAKDOWN'>('jobType')
        return (
          <Badge variant={jobType === 'BREAKDOWN' ? 'destructive' : 'success'}>
            {jobType === 'BREAKDOWN' ? 'Breakdown' : 'Preventative'}
          </Badge>
        )
      },
    },
    {
      accessorKey: 'workshop.name',
      header: 'Workshop',
      cell: ({ row }) => row.original.workshop?.name || '-',
    },
    {
      accessorKey: 'partsCost',
      header: 'Parts Cost',
      cell: ({ row }) => formatCurrency(Number(row.getValue<number>('partsCost'))),
    },
    {
      accessorKey: 'labourCost',
      header: 'Labour Cost',
      cell: ({ row }) => formatCurrency(Number(row.getValue<number>('labourCost'))),
    },
    {
      accessorKey: 'totalCost',
      header: 'Total Cost',
      cell: ({ row }) => (
        <span className="font-medium">
          {formatCurrency(Number(row.getValue<number>('totalCost')))}
        </span>
      ),
    },
    {
      id: 'actions',
      header: 'Actions',
      cell: ({ row }) => {
        const job = row.original
        return (
          <Button
            variant="ghost"
            size="icon"
            onClick={async () => {
              if (
                confirm('Are you sure you want to delete this maintenance job?')
              ) {
                setDeletingId(job.id)
                const result = await deleteMaintenanceJobAction(job.id)
                setDeletingId(null)
                if (result.success) {
                  router.refresh()
                } else {
                  alert(result.error || 'Failed to delete maintenance job')
                }
              }
            }}
            disabled={deletingId === job.id}
          >
            <Trash2 className="h-4 w-4 text-red-600" />
          </Button>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onSortingChange: setSorting,
    state: { sorting },
    initialState: { pagination: { pageSize: 10 } },
  })

  return (
    <div className="space-y-4">
      <div className="rounded-md border">
        <TableContainer>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={columns.length} className="h-24 text-center">
                    No maintenance jobs found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {total > 0 ? `${total} total job${total === 1 ? '' : 's'}` : 'No jobs'}
        </p>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  )
}

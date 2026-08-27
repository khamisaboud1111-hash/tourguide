"use client";

import { ReactNode, type ChangeEvent } from "react";
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react";

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T, index: number) => ReactNode;
  className?: string;
  sortable?: boolean;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  onRowClick?: (row: T) => void;
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    onPageChange: (page: number) => void;
  };
  sorting?: {
    column: string;
    direction: "asc" | "desc";
    onSort: (column: string) => void;
  };
  emptyMessage?: string;
  loading?: boolean;
  selectable?: boolean;
  selectedKeys?: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
  actions?: (row: T) => ReactNode;
}

function SortableHeader({ column, sorting, onSort }: { column: Column<any>; sorting?: DataTableProps<any>["sorting"]; onSort?: (column: string) => void }) {
  if (!column.sortable || !onSort) return <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider">{column.header}</th>;

  const isActive = sorting?.column === column.key;
  const direction = sorting?.direction;

  return (
    <th className="px-4 py-3 text-left text-xs font-semibold text-stone-500 uppercase tracking-wider cursor-pointer hover:bg-stone-50 select-none">
      <div className="flex items-center gap-1">
        {column.header}
        {isActive && (
          <span className="flex">
            {direction === "asc" ? <ChevronUp size={14} className="text-clove-600" /> : <ChevronDown size={14} className="text-clove-600" />}
          </span>
        )}
        {!isActive && <span className="text-stone-300"><ChevronUp size={12} /> <ChevronDown size={12} /></span>}
      </div>
    </th>
  );
}

export default function DataTable<T>({
  columns,
  data,
  keyExtractor,
  onRowClick,
  pagination,
  sorting,
  emptyMessage = "No data available",
  loading = false,
  selectable = false,
  selectedKeys = new Set(),
  onSelectionChange,
  actions,
}: DataTableProps<T>) {
  const handleSelectAll = (e: ChangeEvent<HTMLInputElement>) => {
    onSelectionChange?.(e.target.checked ? new Set(data.map(keyExtractor)) : new Set());
  };

  if (loading) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <div className="animate-pulse space-y-4 p-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-12 bg-stone-100 rounded-xl" />
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
        <div className="py-12 px-6 text-center">
          <p className="text-stone-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-stone-200 bg-white overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full" role="grid">
          <thead className="bg-stone-50 border-b border-stone-200">
            <tr>
              {selectable && (
                <th className="px-4 py-3">
                  <input type="checkbox" className="rounded border-stone-300" onChange={handleSelectAll} />
                </th>
              )}
              {columns.map((col) => (
                <SortableHeader key={col.key} column={col} sorting={sorting} onSort={sorting?.onSort} />
              ))}
              {actions && <th className="px-4 py-3 text-right text-xs font-semibold text-stone-500 uppercase tracking-wider">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {data.map((row, index) => {
              const key = keyExtractor(row);
              const isSelected = selectedKeys.has(key);
              return (
                <tr
                  key={key}
                  className={`transition-colors ${onRowClick ? "cursor-pointer" : ""} ${isSelected ? "bg-clove-50" : index % 2 === 0 ? "bg-white" : "bg-stone-50"} hover:bg-stone-50/50`}
                  onClick={() => onRowClick?.(row)}
                  onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onRowClick?.(row); }}}
                  tabIndex={onRowClick ? 0 : undefined}
                >
                  {selectable && (
                    <td className="px-4 py-3">
                      <input type="checkbox" checked={isSelected} onChange={(e) => {
                        e.stopPropagation();
                        const newKeys = new Set(selectedKeys);
                        if (e.target.checked) newKeys.add(key); else newKeys.delete(key);
                        onSelectionChange?.(newKeys);
                      }} className="rounded border-stone-300" />
                    </td>
                  )}
                  {columns.map((col) => (
                    <td key={col.key} className={`px-4 py-3 text-sm text-stone-700 ${col.className || ""}`}>
                      {col.render ? col.render(row, index) : String((row as any)[col.key] ?? "")}
                    </td>
                  ))}
                  {actions && (
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {actions(row)}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {pagination && (
        <div className="px-4 py-3 border-t border-stone-200 flex items-center justify-between">
          <p className="text-sm text-stone-500">
            Showing {(pagination.page - 1) * pagination.pageSize + 1} to {Math.min(pagination.page * pagination.pageSize, pagination.total)} of {pagination.total}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.page - 1)}
              disabled={pagination.page === 1}
              className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Previous page"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.page + 1)}
              disabled={pagination.page * pagination.pageSize >= pagination.total}
              className="p-2 rounded-lg border border-stone-200 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
              aria-label="Next page"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
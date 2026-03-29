import React, { useState } from 'react';
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Search, Loader2 } from 'lucide-react';
import './DataTable.css';

export interface ColumnDef<T> {
  header: string;
  accessorKey: keyof T | string;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  searchable?: boolean;
  searchPlaceholder?: string;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (item: T) => void;
  loading?: boolean;
  totalCount?: number;
  onPageChange?: (page: number) => void;
  onSearchChange?: (term: string) => void;
  onSortChange?: (key: string, direction: 'asc' | 'desc') => void;
  serverSide?: boolean;
}

export function DataTable<T>({
  data,
  columns,
  searchable = true,
  searchPlaceholder = 'Tìm kiếm...',
  pagination = true,
  pageSize = 10,
  onRowClick,
  loading = false,
  totalCount,
  onPageChange,
  onSearchChange,
  onSortChange,
  serverSide = false,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: 'asc' | 'desc' } | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const searchTimeoutRef = React.useRef<any>(null);

  // Client-side Filter (only if not serverSide)
  const filteredData = React.useMemo(() => {
    if (serverSide || !searchTerm) return data;
    return data.filter(item => {
      return Object.values(item as any).some(val => 
        String(val).toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [data, searchTerm, serverSide]);

  // Client-side Sort (only if not serverSide)
  const sortedData = React.useMemo(() => {
    if (serverSide || !sortConfig) return filteredData;
    
    return [...filteredData].sort((a: any, b: any) => {
      const aVal = a[sortConfig.key];
      const bVal = b[sortConfig.key];

      if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortConfig, serverSide]);

  // Pagination Logic
  const effectiveTotalCount = serverSide ? (totalCount || 0) : sortedData.length;
  const totalPages = Math.ceil(effectiveTotalCount / pageSize);
  
  const currentData = React.useMemo(() => {
    if (!pagination || serverSide) return sortedData;
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, pagination, currentPage, pageSize, serverSide]);

  const requestSort = (key: string, sortable?: boolean) => {
    if (!sortable) return;
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
    if (serverSide && onSortChange) {
      onSortChange(key, direction);
    }
  };

  const handleSearchChange = (val: string) => {
    setSearchTerm(val);
    if (serverSide && onSearchChange) {
      if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = setTimeout(() => {
        onSearchChange(val);
        setCurrentPage(1);
      }, 500); // 500ms debounce
    }
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (serverSide && onPageChange) {
      onPageChange(newPage);
    }
  };

  return (
    <div className="datatable-container glass-panel">
      {searchable && (
        <div className="datatable-toolbar">
          <div className="search-box">
            <Search size={16} className="text-muted" />
            <input 
              type="text" 
              placeholder={searchPlaceholder}
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
            />
          </div>
          {serverSide && totalCount !== undefined && (
            <div className="text-xs text-muted font-medium ml-auto">
               Tìm thấy <span className="text-primary">{totalCount}</span> tài liệu
            </div>
          )}
        </div>
      )}

      <div className="table-responsive">
        <table className="datatable">
          <thead>
            <tr>
              {columns.map((col, idx) => (
                <th 
                  key={idx} 
                  onClick={() => requestSort(col.accessorKey as string, col.sortable)}
                  className={col.sortable ? 'sortable' : ''}
                >
                  <div className="th-content">
                    {col.header}
                    {col.sortable && sortConfig?.key === col.accessorKey && (
                      <span className="sort-icon">
                        {sortConfig.direction === 'asc' ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-12">
                   <div className="flex-center flex-col gap-3">
                      <Loader2 className="animate-spin text-primary" size={32} />
                      <span className="text-muted text-sm font-medium">Đang tải dữ liệu...</span>
                   </div>
                </td>
              </tr>
            ) : currentData.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="text-center py-8 text-muted">
                  Không tìm thấy dữ liệu
                </td>
              </tr>
            ) : (
              currentData.map((row, rIdx) => (
                <tr 
                  key={rIdx} 
                  onClick={() => onRowClick && onRowClick(row)}
                  className={onRowClick ? 'clickable-row' : ''}
                >
                  {columns.map((col, cIdx) => (
                    <td key={cIdx}>
                      {col.cell ? col.cell(row) : (row as any)[col.accessorKey]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && totalPages > 1 && !loading && (
        <div className="datatable-pagination">
          <span className="page-info">
            Trang {currentPage} / {totalPages} {serverSide && `(Tổng ${totalCount} bản ghi)`}
          </span>
          <div className="pagination-controls">
            <button 
              disabled={currentPage === 1}
              onClick={() => handlePageChange(currentPage - 1)}
            >
              <ChevronLeft size={16} />
            </button>
            <button 
              disabled={currentPage === totalPages}
              onClick={() => handlePageChange(currentPage + 1)}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

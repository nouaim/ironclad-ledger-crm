
import React from "react";
import { Link } from "react-router-dom";
import { Edit, Eye, Trash2 } from "lucide-react";

interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (item: T) => React.ReactNode;
}

interface DataTableProps<T> {
  data: T[];
  columns: Column<T>[];
  keyExtractor: (item: T) => string;
  onDelete?: (item: T) => void;
  detailPath?: string;
  editPath?: string;
}

function DataTable<T>({
  data,
  columns,
  keyExtractor,
  onDelete,
  detailPath,
  editPath,
}: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.header}
              </th>
            ))}
            <th scope="col" className="px-6 py-3 text-right">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.length > 0 ? (
            data.map((item) => (
              <tr key={keyExtractor(item)} className="hover:bg-gray-50">
                {columns.map((column, index) => (
                  <td
                    key={index}
                    className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                  >
                    {column.render
                      ? column.render(item)
                      : (item[column.accessor] as React.ReactNode)}
                  </td>
                ))}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right space-x-2">
                  {detailPath && (
                    <Link
                      to={`${detailPath}/${keyExtractor(item)}`}
                      className="text-blue-600 hover:text-blue-900 inline-block"
                    >
                      <Eye size={16} />
                    </Link>
                  )}
                  {editPath && (
                    <Link
                      to={`${editPath}/${keyExtractor(item)}`}
                      className="text-amber-600 hover:text-amber-900 inline-block"
                    >
                      <Edit size={16} />
                    </Link>
                  )}
                  {onDelete && (
                    <button
                      onClick={() => onDelete(item)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length + 1}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No data available
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DataTable;

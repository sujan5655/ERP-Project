import { useState } from "react";
import type { ReactNode } from "react";

import { useGetReportQuery } from "../features/reports/reportsApi";

import type {
  ReportType,
  SalesSummary,
  PurchaseSummary,
  InventorySummary,
  PaymentSummary,
  SalesRecord,
  PurchaseRecord,
  InventoryRecord,
  PaymentRecord,
} from "../features/reports/types";

export default function ReportsPage() {
  const [reportType, setReportType] = useState<ReportType>("sales");

  const [startDate, setStartDate] = useState("");

  const [endDate, setEndDate] = useState("");

  const { data, isLoading, isError } = useGetReportQuery({
    report_type: reportType,
    start_date: startDate || undefined,
    end_date: endDate || undefined,
  });

  const formatMoney = (value: number | string) => {
    return `Rs. ${Number(value).toLocaleString()}`;
  };

  const clearFilters = () => {
    setStartDate("");
    setEndDate("");
  };

  return (
    <div className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Reports</h1>

        <p className="mt-1 text-gray-500">
          Analyze sales, purchases, inventory, and payments.
        </p>
      </div>

      {/* Filters */}
      <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {/* Report Type */}
          <div>
            <label
              htmlFor="report-type"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Report Type
            </label>

            <select
              id="report-type"
              value={reportType}
              onChange={(event) =>
                setReportType(event.target.value as ReportType)
              }
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
            >
              <option value="sales">Sales</option>

              <option value="purchases">Purchases</option>

              <option value="inventory">Inventory</option>

              <option value="payments">Payments</option>
            </select>
          </div>

          {/* Start Date */}
          <div>
            <label
              htmlFor="start-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Start Date
            </label>

            <input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
            />
          </div>

          {/* End Date */}
          <div>
            <label
              htmlFor="end-date"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              End Date
            </label>

            <input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(event) => setEndDate(event.target.value)}
              className="w-full rounded-lg border border-gray-300 px-3 py-2.5 outline-none focus:border-gray-500"
            />
          </div>

          {/* Clear Button */}
          <div className="flex items-end">
            <button
              type="button"
              onClick={clearFilters}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 font-medium text-gray-700 hover:bg-gray-50"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Loading */}
      {isLoading && (
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
          <p className="text-gray-500">Loading report...</p>
        </div>
      )}

      {/* Error */}
      {isError && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-6">
          <p className="font-medium text-red-700">Failed to load report.</p>

          <p className="mt-1 text-sm text-red-600">
            Please check the backend server and try again.
          </p>
        </div>
      )}

      {/* Report Content */}
      {!isLoading && !isError && data?.success && (
        <>
          {/* SALES */}
          {reportType === "sales" && (
            <>
              <SalesSummaryCards
                summary={data.summary as SalesSummary}
                formatMoney={formatMoney}
              />

              <SalesTable
                records={data.records as SalesRecord[]}
                formatMoney={formatMoney}
              />
            </>
          )}

          {/* PURCHASES */}
          {reportType === "purchases" && (
            <>
              <PurchaseSummaryCards
                summary={data.summary as PurchaseSummary}
                formatMoney={formatMoney}
              />

              <PurchaseTable
                records={data.records as PurchaseRecord[]}
                formatMoney={formatMoney}
              />
            </>
          )}

          {/* INVENTORY */}
          {reportType === "inventory" && (
            <>
              <InventorySummaryCards
                summary={data.summary as InventorySummary}
              />

              <InventoryTable records={data.records as InventoryRecord[]} />
            </>
          )}

          {/* PAYMENTS */}
          {reportType === "payments" && (
            <>
              <PaymentSummaryCards
                summary={data.summary as PaymentSummary}
                formatMoney={formatMoney}
              />

              <PaymentTable
                records={data.records as PaymentRecord[]}
                formatMoney={formatMoney}
              />
            </>
          )}
        </>
      )}
    </div>
  );
}

/* =====================================================
   SUMMARY CARDS
===================================================== */

function SalesSummaryCards({
  summary,
  formatMoney,
}: {
  summary: SalesSummary;
  formatMoney: (value: number | string) => string;
}) {
  return (
    <SummaryGrid
      cards={[
        {
          title: "Total Orders",
          value: summary.total_orders,
        },
        {
          title: "Total Items",
          value: summary.total_items,
        },
        {
          title: "Total Sales",
          value: formatMoney(summary.total_amount),
        },
      ]}
    />
  );
}

function PurchaseSummaryCards({
  summary,
  formatMoney,
}: {
  summary: PurchaseSummary;
  formatMoney: (value: number | string) => string;
}) {
  return (
    <SummaryGrid
      cards={[
        {
          title: "Total Orders",
          value: summary.total_orders,
        },
        {
          title: "Total Items",
          value: summary.total_items,
        },
        {
          title: "Total Purchases",
          value: formatMoney(summary.total_amount),
        },
      ]}
    />
  );
}

function InventorySummaryCards({ summary }: { summary: InventorySummary }) {
  return (
    <SummaryGrid
      cards={[
        {
          title: "Inventory Records",
          value: summary.total_products,
        },
        {
          title: "Total Quantity",
          value: summary.total_quantity,
        },
      ]}
    />
  );
}

function PaymentSummaryCards({
  summary,
  formatMoney,
}: {
  summary: PaymentSummary;
  formatMoney: (value: number | string) => string;
}) {
  return (
    <SummaryGrid
      cards={[
        {
          title: "Total Payments",
          value: summary.total_payments,
        },
        {
          title: "Total Amount",
          value: formatMoney(summary.total_amount),
        },
        {
          title: "Paid",
          value: formatMoney(summary.paid_amount),
        },
        {
          title: "Pending",
          value: formatMoney(summary.pending_amount),
        },
      ]}
    />
  );
}

function SummaryGrid({
  cards,
}: {
  cards: {
    title: string;
    value: number | string;
  }[];
}) {
  return (
    <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.title}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
        >
          <p className="text-sm font-medium text-gray-500">{card.title}</p>

          <p className="mt-2 text-2xl font-bold text-gray-900">{card.value}</p>
        </div>
      ))}
    </div>
  );
}

/* =====================================================
   SALES TABLE
===================================================== */

function SalesTable({
  records,
  formatMoney,
}: {
  records: SalesRecord[];
  formatMoney: (value: number | string) => string;
}) {
  return (
    <ReportTable title="Sales Report">
      <tr>
        <TableHeader>Order</TableHeader>
        <TableHeader>Customer</TableHeader>
        <TableHeader>Warehouse</TableHeader>
        <TableHeader>Status</TableHeader>
        <TableHeader>Date</TableHeader>
        <TableHeader>Total</TableHeader>
      </tr>

      {records.map((record) => (
        <tr key={record.id} className="border-t border-gray-200">
          <TableCell bold>{record.order_number}</TableCell>

          <TableCell>{record.customer}</TableCell>

          <TableCell>{record.warehouse}</TableCell>

          <TableCell>
            <StatusBadge status={record.status} />
          </TableCell>

          <TableCell>{record.order_date}</TableCell>

          <TableCell>{formatMoney(record.total_amount)}</TableCell>
        </tr>
      ))}

      {records.length === 0 && <EmptyTableRow colSpan={6} />}
    </ReportTable>
  );
}

/* =====================================================
   PURCHASE TABLE
===================================================== */

function PurchaseTable({
  records,
  formatMoney,
}: {
  records: PurchaseRecord[];
  formatMoney: (value: number | string) => string;
}) {
  return (
    <ReportTable title="Purchase Report">
      <tr>
        <TableHeader>Order</TableHeader>
        <TableHeader>Supplier</TableHeader>
        <TableHeader>Warehouse</TableHeader>
        <TableHeader>Status</TableHeader>
        <TableHeader>Date</TableHeader>
        <TableHeader>Total</TableHeader>
      </tr>

      {records.map((record) => (
        <tr key={record.id} className="border-t border-gray-200">
          <TableCell bold>{record.order_number}</TableCell>

          <TableCell>{record.supplier}</TableCell>

          <TableCell>{record.warehouse}</TableCell>

          <TableCell>
            <StatusBadge status={record.status} />
          </TableCell>

          <TableCell>{record.order_date}</TableCell>

          <TableCell>{formatMoney(record.total_amount)}</TableCell>
        </tr>
      ))}

      {records.length === 0 && <EmptyTableRow colSpan={6} />}
    </ReportTable>
  );
}

/* =====================================================
   INVENTORY TABLE
===================================================== */

function InventoryTable({ records }: { records: InventoryRecord[] }) {
  return (
    <ReportTable title="Inventory Report">
      <tr>
        <TableHeader>Product</TableHeader>
        <TableHeader>SKU</TableHeader>
        <TableHeader>Warehouse</TableHeader>
        <TableHeader>Quantity</TableHeader>
        <TableHeader>Reorder Level</TableHeader>
        <TableHeader>Status</TableHeader>
      </tr>

      {records.map((record) => (
        <tr key={record.id} className="border-t border-gray-200">
          <TableCell bold>{record.product}</TableCell>

          <TableCell>{record.sku}</TableCell>

          <TableCell>{record.warehouse}</TableCell>

          <TableCell>{record.quantity}</TableCell>

          <TableCell>{record.reorder_level}</TableCell>

          <TableCell>
            {record.is_low_stock ? (
              <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-medium text-red-700">
                Low Stock
              </span>
            ) : (
              <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                Normal
              </span>
            )}
          </TableCell>
        </tr>
      ))}

      {records.length === 0 && <EmptyTableRow colSpan={6} />}
    </ReportTable>
  );
}

/* =====================================================
   PAYMENT TABLE
===================================================== */

function PaymentTable({
  records,
  formatMoney,
}: {
  records: PaymentRecord[];
  formatMoney: (value: number | string) => string;
}) {
  return (
    <ReportTable title="Payment Report">
      <tr>
        <TableHeader>Payment</TableHeader>
        <TableHeader>Sales Order</TableHeader>
        <TableHeader>Amount</TableHeader>
        <TableHeader>Method</TableHeader>
        <TableHeader>Status</TableHeader>
        <TableHeader>Reference</TableHeader>
      </tr>

      {records.map((record) => (
        <tr key={record.id} className="border-t border-gray-200">
          <TableCell bold>{record.payment_number}</TableCell>

          <TableCell>{record.sales_order}</TableCell>

          <TableCell>{formatMoney(record.amount)}</TableCell>

          <TableCell>{record.payment_method}</TableCell>

          <TableCell>
            <StatusBadge status={record.status} />
          </TableCell>

          <TableCell>{record.transaction_reference || "-"}</TableCell>
        </tr>
      ))}

      {records.length === 0 && <EmptyTableRow colSpan={6} />}
    </ReportTable>
  );
}

/* =====================================================
   REUSABLE TABLE COMPONENTS
===================================================== */

function ReportTable({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
      <div className="border-b border-gray-200 p-5">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-left">
          <thead className="bg-gray-50">{children}</thead>
        </table>
      </div>
    </div>
  );
}

function TableHeader({ children }: { children: ReactNode }) {
  return (
    <th className="px-5 py-3 text-sm font-semibold text-gray-700">
      {children}
    </th>
  );
}

function TableCell({
  children,
  bold = false,
}: {
  children: ReactNode;
  bold?: boolean;
}) {
  return (
    <td
      className={`px-5 py-4 text-sm text-gray-700 ${
        bold ? "font-medium text-gray-900" : ""
      }`}
    >
      {children}
    </td>
  );
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
      {status}
    </span>
  );
}

function EmptyTableRow({ colSpan }: { colSpan: number }) {
  return (
    <tr>
      <td
        colSpan={colSpan}
        className="px-5 py-10 text-center text-sm text-gray-500"
      >
        No records found.
      </td>
    </tr>
  );
}

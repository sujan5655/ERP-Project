import { useGetDashboardQuery } from "../features/dashboard/dashboardApi";

export default function DashboardPage() {
  const { data, isLoading, isError } = useGetDashboardQuery();

  if (isLoading) {
    return (
      <div className="p-6">
        <p className="text-gray-600">Loading dashboard...</p>
      </div>
    );
  }

  if (isError || !data?.success) {
    return (
      <div className="p-6">
        <p className="text-red-600">Failed to load dashboard.</p>
      </div>
    );
  }

  const { summary, recent_sales, recent_stock_movements } = data;

  const cards = [
    {
      title: "Companies",
      value: summary.total_companies,
    },
    {
      title: "Branches",
      value: summary.total_branches,
    },
    {
      title: "Warehouses",
      value: summary.total_warehouses,
    },
    {
      title: "Employees",
      value: summary.total_employees,
    },
    {
      title: "Products",
      value: summary.total_products,
    },
    {
      title: "Inventory",
      value: summary.total_inventory_quantity,
    },
    {
      title: "Low Stock",
      value: summary.low_stock_products,
    },
    {
      title: "Suppliers",
      value: summary.total_suppliers,
    },
    {
      title: "Customers",
      value: summary.total_customers,
    },
    {
      title: "Purchase Orders",
      value: summary.total_purchase_orders,
    },
    {
      title: "Sales Orders",
      value: summary.total_sales_orders,
    },
    {
      title: "Paid",
      value: `Rs. ${summary.total_paid}`,
    },
    {
      title: "Pending Payments",
      value: `Rs. ${summary.total_pending_payments}`,
    },
  ];

  return (
    <div className="p-6 space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>

        <p className="mt-1 text-gray-500">Overview of your retail ERP system</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-gray-500">{card.title}</p>

            <p className="mt-2 text-2xl font-bold text-gray-900">
              {card.value}
            </p>
          </div>
        ))}
      </div>

      {/* Recent Sales */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-900">Recent Sales</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-sm font-semibold">Order</th>
                <th className="px-5 py-3 text-sm font-semibold">Customer</th>
                <th className="px-5 py-3 text-sm font-semibold">Warehouse</th>
                <th className="px-5 py-3 text-sm font-semibold">Status</th>
                <th className="px-5 py-3 text-sm font-semibold">Date</th>
              </tr>
            </thead>

            <tbody>
              {recent_sales.map((sale) => (
                <tr key={sale.id} className="border-t border-gray-200">
                  <td className="px-5 py-4 font-medium">{sale.order_number}</td>

                  <td className="px-5 py-4">{sale.customer}</td>

                  <td className="px-5 py-4">{sale.warehouse}</td>

                  <td className="px-5 py-4">
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700">
                      {sale.status}
                    </span>
                  </td>

                  <td className="px-5 py-4">{sale.order_date}</td>
                </tr>
              ))}

              {recent_sales.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No recent sales.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Stock Movements */}
      <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 p-5">
          <h2 className="text-xl font-semibold text-gray-900">
            Recent Stock Movements
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-sm font-semibold">Product</th>
                <th className="px-5 py-3 text-sm font-semibold">Warehouse</th>
                <th className="px-5 py-3 text-sm font-semibold">Type</th>
                <th className="px-5 py-3 text-sm font-semibold">Quantity</th>
                <th className="px-5 py-3 text-sm font-semibold">Reference</th>
              </tr>
            </thead>

            <tbody>
              {recent_stock_movements.map((movement) => (
                <tr key={movement.id} className="border-t border-gray-200">
                  <td className="px-5 py-4 font-medium">{movement.product}</td>

                  <td className="px-5 py-4">{movement.warehouse}</td>

                  <td className="px-5 py-4">{movement.movement_type}</td>

                  <td className="px-5 py-4">{movement.quantity}</td>

                  <td className="px-5 py-4">{movement.reference || "-"}</td>
                </tr>
              ))}

              {recent_stock_movements.length === 0 && (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-8 text-center text-gray-500"
                  >
                    No recent stock movements.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

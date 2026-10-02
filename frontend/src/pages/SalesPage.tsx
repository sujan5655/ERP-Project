import { useState } from "react";

import {
  useGetSalesOrdersQuery,
  useGetSalesOrderQuery,
  useCreateSalesOrderMutation,
  useCreateSalesOrderItemMutation,
  useUpdateSalesOrderItemMutation,
  useDeleteSalesOrderItemMutation,
  useConfirmSalesOrderMutation,
} from "../features/sales/salesApi";

import { useGetWarehousesQuery } from "../features/warehouses/warehouseApi";

import { useGetProductsQuery } from "../features/products/productApi";
import { useGetCustomersQuery } from "../features/customers/customerApi";

export default function SalesPage() {
  const { data: salesData, isLoading: salesLoading } = useGetSalesOrdersQuery();

  const { data: customersData } = useGetCustomersQuery();

  const { data: warehousesData } = useGetWarehousesQuery();

  const { data: productsData } = useGetProductsQuery();

  const [createSalesOrder] = useCreateSalesOrderMutation();

  const [createSalesOrderItem] = useCreateSalesOrderItemMutation();

  const [updateSalesOrderItem] = useUpdateSalesOrderItemMutation();

  const [deleteSalesOrderItem] = useDeleteSalesOrderItemMutation();

  const [confirmSalesOrder] = useConfirmSalesOrderMutation();

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);

  const { data: selectedOrderData } = useGetSalesOrderQuery(
    selectedOrderId as number,
    {
      skip: selectedOrderId === null,
    },
  );

  const [customer, setCustomer] = useState("");

  const [warehouse, setWarehouse] = useState("");

  const [orderNumber, setOrderNumber] = useState("");

  const [orderDate, setOrderDate] = useState("");

  const [notes, setNotes] = useState("");

  const [product, setProduct] = useState("");

  const [quantity, setQuantity] = useState("");

  const [unitPrice, setUnitPrice] = useState("");

  const [taxRate, setTaxRate] = useState("0");

  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const customers = customersData?.customers ?? [];

  const warehouses = warehousesData?.warehouses ?? [];

  const products = productsData?.products ?? [];

  const salesOrders = salesData?.sales_orders ?? [];

  const selectedOrder = selectedOrderData?.sales_order;

  const clearMessages = () => {
    setMessage("");
    setError("");
  };

  const handleCreateOrder = async (event: React.FormEvent) => {
    event.preventDefault();

    clearMessages();

    try {
      const result = await createSalesOrder({
        customer: Number(customer),
        warehouse: Number(warehouse),
        order_number: orderNumber,
        order_date: orderDate,
        notes,
      }).unwrap();

      setMessage("Sales order created successfully.");

      setSelectedOrderId(result.sales_order.id);

      setCustomer("");
      setWarehouse("");
      setOrderNumber("");
      setOrderDate("");
      setNotes("");
    } catch (err: any) {
      setError(
        err?.data?.detail ||
          err?.data?.message ||
          "Failed to create sales order.",
      );
    }
  };

  const resetItemForm = () => {
    setProduct("");
    setQuantity("");
    setUnitPrice("");
    setTaxRate("0");
    setEditingItemId(null);
  };

  const handleSaveItem = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!selectedOrder) {
      setError("Please select a sales order first.");
      return;
    }

    clearMessages();

    try {
      const body = {
        product: Number(product),
        quantity,
        unit_price: unitPrice,
        tax_rate: taxRate,
      };

      if (editingItemId !== null) {
        await updateSalesOrderItem({
          salesOrderId: selectedOrder.id,

          itemId: editingItemId,

          body,
        }).unwrap();

        setMessage("Sales order item updated successfully.");
      } else {
        await createSalesOrderItem({
          salesOrderId: selectedOrder.id,

          body,
        }).unwrap();

        setMessage("Sales order item added successfully.");
      }

      resetItemForm();
    } catch (err: any) {
      setError(
        err?.data?.detail ||
          err?.data?.message ||
          "Failed to save sales order item.",
      );
    }
  };

  const handleEditItem = (item: any) => {
    setEditingItemId(item.id);

    setProduct(String(item.product));

    setQuantity(item.quantity);

    setUnitPrice(item.unit_price);

    setTaxRate(item.tax_rate);
  };

  const handleDeleteItem = async (itemId: number) => {
    if (!selectedOrder) {
      return;
    }

    clearMessages();

    try {
      await deleteSalesOrderItem({
        salesOrderId: selectedOrder.id,

        itemId,
      }).unwrap();

      setMessage("Sales order item deleted successfully.");
    } catch (err: any) {
      setError(
        err?.data?.detail || err?.data?.message || "Failed to delete item.",
      );
    }
  };

  const handleConfirmOrder = async () => {
    if (!selectedOrder) {
      return;
    }

    clearMessages();

    try {
      await confirmSalesOrder(selectedOrder.id).unwrap();

      setMessage("Sales order confirmed successfully.");

      resetItemForm();
    } catch (err: any) {
      setError(
        err?.data?.detail ||
          err?.data?.message ||
          "Failed to confirm sales order.",
      );
    }
  };

  if (salesLoading) {
    return <div className="p-6">Loading sales orders...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Sales</h1>

        <p className="text-gray-600">Create and manage sales orders.</p>
      </div>

      {message && (
        <div className="rounded bg-green-100 p-3 text-green-700">{message}</div>
      )}

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      {/* CREATE ORDER */}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Create Sales Order</h2>

        <form
          onSubmit={handleCreateOrder}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <select
            value={customer}
            onChange={(e) => setCustomer(e.target.value)}
            className="rounded border p-2"
            required
          >
            <option value="">Select Customer</option>

            {customers.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>

          <select
            value={warehouse}
            onChange={(e) => setWarehouse(e.target.value)}
            className="rounded border p-2"
            required
          >
            <option value="">Select Warehouse</option>

            {warehouses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.code})
              </option>
            ))}
          </select>

          <input
            type="text"
            placeholder="Order Number"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            className="rounded border p-2"
            required
          />

          <input
            type="date"
            value={orderDate}
            onChange={(e) => setOrderDate(e.target.value)}
            className="rounded border p-2"
            required
          />

          <textarea
            placeholder="Notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="rounded border p-2 md:col-span-2"
          />

          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
          >
            Create Sales Order
          </button>
        </form>
      </div>

      {/* SALES ORDERS */}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Sales Orders</h2>

        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Order</th>

                <th className="p-3 text-left">Customer</th>

                <th className="p-3 text-left">Warehouse</th>

                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-left">Action</th>
              </tr>
            </thead>

            <tbody>
              {salesOrders.map((order) => {
                const customer = customers.find(
                  (item) => item.id === order.customer,
                );

                const warehouse = warehouses.find(
                  (item) => item.id === order.warehouse,
                );

                return (
                  <tr key={order.id} className="border-b">
                    <td className="p-3">{order.order_number}</td>

                    <td className="p-3">{customer?.name || order.customer}</td>

                    <td className="p-3">
                      {warehouse?.name || order.warehouse}
                    </td>

                    <td className="p-3">{order.status}</td>

                    <td className="p-3">
                      <button
                        onClick={() => setSelectedOrderId(order.id)}
                        className="rounded bg-gray-800 px-3 py-1 text-white"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ORDER DETAIL */}

      {selectedOrder && (
        <div className="rounded-lg bg-white p-6 shadow">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold">
                {selectedOrder.order_number}
              </h2>

              <p className="text-sm text-gray-600">
                Status: {selectedOrder.status}
              </p>
            </div>

            {selectedOrder.status === "DRAFT" && (
              <button
                onClick={handleConfirmOrder}
                className="rounded bg-green-600 px-4 py-2 text-white hover:bg-green-700"
              >
                Confirm Sale
              </button>
            )}
          </div>

          {/* ADD ITEM */}

          {selectedOrder.status === "DRAFT" && (
            <form
              onSubmit={handleSaveItem}
              className="mb-6 grid grid-cols-1 gap-4 md:grid-cols-4"
            >
              <select
                value={product}
                onChange={(e) => setProduct(e.target.value)}
                className="rounded border p-2"
                required
              >
                <option value="">Select Product</option>

                {products.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.sku})
                  </option>
                ))}
              </select>

              <input
                type="number"
                step="0.01"
                min="0.01"
                placeholder="Quantity"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                className="rounded border p-2"
                required
              />

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Unit Price"
                value={unitPrice}
                onChange={(e) => setUnitPrice(e.target.value)}
                className="rounded border p-2"
                required
              />

              <input
                type="number"
                step="0.01"
                min="0"
                placeholder="Tax Rate"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                className="rounded border p-2"
              />

              <button
                type="submit"
                className="rounded bg-blue-600 px-4 py-2 text-white"
              >
                {editingItemId ? "Update Item" : "Add Item"}
              </button>

              {editingItemId && (
                <button
                  type="button"
                  onClick={resetItemForm}
                  className="rounded bg-gray-500 px-4 py-2 text-white"
                >
                  Cancel Edit
                </button>
              )}
            </form>
          )}

          {/* ITEMS */}

          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="p-3 text-left">Product</th>

                  <th className="p-3 text-left">Quantity</th>

                  <th className="p-3 text-left">Unit Price</th>

                  <th className="p-3 text-left">Tax</th>

                  <th className="p-3 text-left">Total</th>

                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {selectedOrder.items.map((item) => {
                  const product = products.find(
                    (product) => product.id === item.product,
                  );

                  return (
                    <tr key={item.id} className="border-b">
                      <td className="p-3">{product?.name || item.product}</td>

                      <td className="p-3">{item.quantity}</td>

                      <td className="p-3">{item.unit_price}</td>

                      <td className="p-3">{item.tax_amount}</td>

                      <td className="p-3">{item.total}</td>

                      <td className="p-3 space-x-2">
                        {selectedOrder.status === "DRAFT" && (
                          <>
                            <button
                              onClick={() => handleEditItem(item)}
                              className="rounded bg-yellow-500 px-3 py-1 text-white"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDeleteItem(item.id)}
                              className="rounded bg-red-600 px-3 py-1 text-white"
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

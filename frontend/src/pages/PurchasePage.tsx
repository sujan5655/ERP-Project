import { useState } from "react";

import {
  useGetPurchaseOrdersQuery,
  useGetPurchaseOrderQuery,
  useCreatePurchaseOrderMutation,
  useCreatePurchaseOrderItemMutation,
  useUpdatePurchaseOrderItemMutation,
  useDeletePurchaseOrderItemMutation,
  useConfirmPurchaseOrderMutation,
  useReceivePurchaseOrderMutation,
} from "../features/purchasing/purchasingApi";

import { useGetSuppliersQuery } from "../features/suppliers/supplierApi";

import { useGetWarehousesQuery } from "../features/warehouses/warehouseApi";

import { useGetProductsQuery } from "../features/products/productApi";

import type {
  CreatePurchaseOrderRequest,
  CreatePurchaseOrderItemRequest,
} from "../features/purchasing/types";

const PurchasingPage = () => {
  // =========================================================
  // DATA
  // =========================================================

  const { data: purchaseOrdersData, isLoading: purchaseOrdersLoading } =
    useGetPurchaseOrdersQuery();

  const { data: suppliersData, isLoading: suppliersLoading } =
    useGetSuppliersQuery();

  const { data: warehousesData, isLoading: warehousesLoading } =
    useGetWarehousesQuery();

  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery();

  const suppliers = suppliersData?.suppliers ?? [];

  const warehouses = warehousesData?.warehouses ?? [];

  const products = productsData?.products ?? [];

  const purchaseOrders = purchaseOrdersData?.purchase_orders ?? [];

  // =========================================================
  // SELECTED PURCHASE ORDER
  // =========================================================

  const [selectedId, setSelectedId] = useState<number | null>(null);

  const { data: selectedOrderData, isLoading: selectedOrderLoading } =
    useGetPurchaseOrderQuery(selectedId as number, {
      skip: selectedId === null,
    });

  const selectedOrder = selectedOrderData?.purchase_order;

  // =========================================================
  // MUTATIONS
  // =========================================================

  const [createPurchaseOrder, { isLoading: creatingOrder }] =
    useCreatePurchaseOrderMutation();

  const [createPurchaseOrderItem, { isLoading: creatingItem }] =
    useCreatePurchaseOrderItemMutation();

  const [updatePurchaseOrderItem, { isLoading: updatingItem }] =
    useUpdatePurchaseOrderItemMutation();

  const [deletePurchaseOrderItem, { isLoading: deletingItem }] =
    useDeletePurchaseOrderItemMutation();

  const [confirmPurchaseOrder, { isLoading: confirmingOrder }] =
    useConfirmPurchaseOrderMutation();

  const [receivePurchaseOrder, { isLoading: receivingOrder }] =
    useReceivePurchaseOrderMutation();

  // =========================================================
  // CREATE PO FORM
  // =========================================================

  const [supplier, setSupplier] = useState("");

  const [warehouse, setWarehouse] = useState("");

  const [orderNumber, setOrderNumber] = useState("");

  const [orderDate, setOrderDate] = useState("");

  const [expectedDate, setExpectedDate] = useState("");

  const [notes, setNotes] = useState("");

  // =========================================================
  // ITEM FORM
  // =========================================================

  const [product, setProduct] = useState("");

  const [quantity, setQuantity] = useState("");

  const [unitCost, setUnitCost] = useState("");

  const [taxRate, setTaxRate] = useState("0");

  const [editingItemId, setEditingItemId] = useState<number | null>(null);

  // =========================================================
  // MESSAGE
  // =========================================================

  const [message, setMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  // =========================================================
  // RESET ITEM FORM
  // =========================================================

  const resetItemForm = () => {
    setProduct("");
    setQuantity("");
    setUnitCost("");
    setTaxRate("0");
    setEditingItemId(null);
  };

  // =========================================================
  // CREATE PURCHASE ORDER
  // =========================================================

  const handleCreateOrder = async () => {
    setMessage("");
    setErrorMessage("");

    if (!supplier || !warehouse || !orderNumber || !orderDate) {
      setErrorMessage(
        "Supplier, warehouse, order number and order date are required.",
      );

      return;
    }

    const body: CreatePurchaseOrderRequest = {
      supplier: Number(supplier),
      warehouse: Number(warehouse),
      order_number: orderNumber,
      order_date: orderDate,
      expected_date: expectedDate || undefined,
      notes,
    };

    try {
      const result = await createPurchaseOrder(body).unwrap();

      setMessage(result.message ?? "Purchase order created successfully.");

      setSelectedId(result.purchase_order.id);

      setSupplier("");
      setWarehouse("");
      setOrderNumber("");
      setOrderDate("");
      setExpectedDate("");
      setNotes("");
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? "Failed to create purchase order.",
      );
    }
  };

  // =========================================================
  // ADD / UPDATE ITEM
  // =========================================================

  const handleSaveItem = async () => {
    setMessage("");
    setErrorMessage("");

    if (!selectedId) {
      setErrorMessage("Please select a purchase order first.");

      return;
    }

    if (!product || !quantity || !unitCost) {
      setErrorMessage("Product, quantity and unit cost are required.");

      return;
    }

    const body: CreatePurchaseOrderItemRequest = {
      product: Number(product),
      quantity,
      unit_cost: unitCost,
      tax_rate: taxRate || "0",
    };

    try {
      if (editingItemId) {
        await updatePurchaseOrderItem({
          purchaseOrderId: selectedId,
          itemId: editingItemId,
          body,
        }).unwrap();

        setMessage("Purchase order item updated successfully.");
      } else {
        await createPurchaseOrderItem({
          purchaseOrderId: selectedId,
          body,
        }).unwrap();

        setMessage("Purchase order item added successfully.");
      }

      resetItemForm();
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? "Failed to save purchase order item.",
      );
    }
  };

  // =========================================================
  // EDIT ITEM
  // =========================================================

  const handleEditItem = (item: {
    id: number;
    product: number;
    quantity: string;
    unit_cost: string;
    tax_rate: string;
  }) => {
    setEditingItemId(item.id);

    setProduct(String(item.product));

    setQuantity(item.quantity);

    setUnitCost(item.unit_cost);

    setTaxRate(item.tax_rate);

    setMessage("");
    setErrorMessage("");
  };

  // =========================================================
  // DELETE ITEM
  // =========================================================

  const handleDeleteItem = async (itemId: number) => {
    if (!selectedId) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      await deletePurchaseOrderItem({
        purchaseOrderId: selectedId,
        itemId,
      }).unwrap();

      setMessage("Purchase order item deleted successfully.");
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? "Failed to delete purchase order item.",
      );
    }
  };

  // =========================================================
  // CONFIRM PO
  // =========================================================

  const handleConfirm = async () => {
    if (!selectedId) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      await confirmPurchaseOrder(selectedId).unwrap();

      setMessage("Purchase order confirmed successfully.");
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? "Failed to confirm purchase order.",
      );
    }
  };

  // =========================================================
  // RECEIVE PO
  // =========================================================

  const handleReceive = async () => {
    if (!selectedId) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      await receivePurchaseOrder(selectedId).unwrap();

      setMessage(
        "Purchase order received successfully. Inventory has been updated.",
      );
    } catch (error: any) {
      setErrorMessage(
        error?.data?.message ?? "Failed to receive purchase order.",
      );
    }
  };

  // =========================================================
  // LOADING
  // =========================================================

  if (
    purchaseOrdersLoading ||
    suppliersLoading ||
    warehousesLoading ||
    productsLoading
  ) {
    return (
      <div className="p-6">
        <div className="rounded-xl border bg-white p-6">
          <p className="text-gray-600">Loading purchasing data...</p>
        </div>
      </div>
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* ================================================= */}
        {/* HEADER */}
        {/* ================================================= */}

        <div>
          <h1 className="text-3xl font-bold text-gray-900">Purchasing</h1>

          <p className="mt-1 text-gray-500">
            Manage purchase orders, suppliers, receiving and inventory.
          </p>
        </div>

        {/* ================================================= */}
        {/* MESSAGES */}
        {/* ================================================= */}

        {message && (
          <div className="rounded-lg border border-green-200 bg-green-50 p-4 text-green-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-red-700">
            {errorMessage}
          </div>
        )}

        {/* ================================================= */}
        {/* CREATE PURCHASE ORDER */}
        {/* ================================================= */}

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="mb-5">
            <h2 className="text-xl font-semibold text-gray-900">
              Create Purchase Order
            </h2>

            <p className="text-sm text-gray-500">
              Create a new purchase order for a supplier and warehouse.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* SUPPLIER */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Supplier
              </label>

              <select
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5"
              >
                <option value="">Select Supplier</option>

                {suppliers.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.code})
                  </option>
                ))}
              </select>
            </div>

            {/* WAREHOUSE */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Warehouse
              </label>

              <select
                value={warehouse}
                onChange={(e) => setWarehouse(e.target.value)}
                className="w-full rounded-lg border border-gray-300 bg-white p-2.5"
              >
                <option value="">Select Warehouse</option>

                {warehouses.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.name} ({item.code})
                  </option>
                ))}
              </select>
            </div>

            {/* ORDER NUMBER */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Order Number
              </label>

              <input
                type="text"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                placeholder="PO-003"
                className="w-full rounded-lg border border-gray-300 p-2.5"
              />
            </div>

            {/* ORDER DATE */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Order Date
              </label>

              <input
                type="date"
                value={orderDate}
                onChange={(e) => setOrderDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5"
              />
            </div>

            {/* EXPECTED DATE */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Expected Date
              </label>

              <input
                type="date"
                value={expectedDate}
                onChange={(e) => setExpectedDate(e.target.value)}
                className="w-full rounded-lg border border-gray-300 p-2.5"
              />
            </div>

            {/* NOTES */}

            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">
                Notes
              </label>

              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Optional notes"
                className="w-full rounded-lg border border-gray-300 p-2.5"
              />
            </div>
          </div>

          <button
            onClick={handleCreateOrder}
            disabled={creatingOrder}
            className="mt-5 rounded-lg bg-black px-5 py-2.5 text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            {creatingOrder ? "Creating..." : "Create Purchase Order"}
          </button>
        </div>

        {/* ================================================= */}
        {/* PURCHASE ORDER LIST */}
        {/* ================================================= */}

        <div className="overflow-hidden rounded-xl border bg-white shadow-sm">
          <div className="border-b p-6">
            <h2 className="text-xl font-semibold">Purchase Orders</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="p-4 text-left text-sm font-semibold">Order</th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Supplier
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Warehouse
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Order Date
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Status
                  </th>

                  <th className="p-4 text-left text-sm font-semibold">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="p-8 text-center text-gray-500">
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((purchaseOrder) => (
                    <tr key={purchaseOrder.id} className="border-t">
                      <td className="p-4 font-medium">
                        {purchaseOrder.order_number}
                      </td>

                      <td className="p-4">{purchaseOrder.supplier}</td>

                      <td className="p-4">{purchaseOrder.warehouse}</td>

                      <td className="p-4">{purchaseOrder.order_date}</td>

                      <td className="p-4">
                        <span className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium">
                          {purchaseOrder.status}
                        </span>
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => setSelectedId(purchaseOrder.id)}
                          className="font-medium text-blue-600 hover:text-blue-800"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* ================================================= */}
        {/* SELECTED PURCHASE ORDER */}
        {/* ================================================= */}

        {selectedId && (
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            {selectedOrderLoading ? (
              <p className="text-gray-500">Loading purchase order...</p>
            ) : selectedOrder ? (
              <div className="space-y-6">
                {/* PO HEADER */}

                <div className="flex flex-col justify-between gap-4 border-b pb-5 md:flex-row">
                  <div>
                    <h2 className="text-2xl font-bold">
                      {selectedOrder.order_number}
                    </h2>

                    <div className="mt-2 space-y-1 text-sm text-gray-600">
                      <p>Supplier ID: {selectedOrder.supplier}</p>

                      <p>Warehouse ID: {selectedOrder.warehouse}</p>

                      <p>Order Date: {selectedOrder.order_date}</p>

                      {selectedOrder.expected_date && (
                        <p>Expected Date: {selectedOrder.expected_date}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="rounded-full bg-gray-100 px-4 py-2 text-sm font-semibold">
                      {selectedOrder.status}
                    </span>
                  </div>
                </div>

                {/* ================================================= */}
                {/* ADD / EDIT ITEM */}
                {/* ================================================= */}

                {selectedOrder.status === "DRAFT" && (
                  <div className="rounded-lg border bg-gray-50 p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">
                          {editingItemId
                            ? "Edit Purchase Item"
                            : "Add Purchase Item"}
                        </h3>

                        <p className="text-sm text-gray-500">
                          Select a product and enter purchasing details.
                        </p>
                      </div>

                      {editingItemId && (
                        <button
                          onClick={resetItemForm}
                          className="text-sm text-gray-600"
                        >
                          Cancel Edit
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
                      {/* PRODUCT */}

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Product
                        </label>

                        <select
                          value={product}
                          onChange={(e) => setProduct(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 bg-white p-2.5"
                        >
                          <option value="">Select Product</option>

                          {products.map((item) => (
                            <option key={item.id} value={item.id}>
                              {item.name} ({item.sku})
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* QUANTITY */}

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Quantity
                        </label>

                        <input
                          type="number"
                          min="0.01"
                          step="0.01"
                          value={quantity}
                          onChange={(e) => setQuantity(e.target.value)}
                          placeholder="10"
                          className="w-full rounded-lg border border-gray-300 p-2.5"
                        />
                      </div>

                      {/* UNIT COST */}

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Unit Cost
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={unitCost}
                          onChange={(e) => setUnitCost(e.target.value)}
                          placeholder="100"
                          className="w-full rounded-lg border border-gray-300 p-2.5"
                        />
                      </div>

                      {/* TAX */}

                      <div>
                        <label className="mb-1 block text-sm font-medium">
                          Tax Rate (%)
                        </label>

                        <input
                          type="number"
                          min="0"
                          step="0.01"
                          value={taxRate}
                          onChange={(e) => setTaxRate(e.target.value)}
                          placeholder="13"
                          className="w-full rounded-lg border border-gray-300 p-2.5"
                        />
                      </div>
                    </div>

                    <button
                      onClick={handleSaveItem}
                      disabled={creatingItem || updatingItem}
                      className="mt-4 rounded-lg bg-black px-5 py-2.5 text-white disabled:opacity-50"
                    >
                      {creatingItem || updatingItem
                        ? "Saving..."
                        : editingItemId
                          ? "Update Item"
                          : "Add Item"}
                    </button>
                  </div>
                )}

                {/* ================================================= */}
                {/* ITEMS */}
                {/* ================================================= */}

                <div>
                  <h3 className="mb-3 text-lg font-semibold">Purchase Items</h3>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="p-3 text-left">Product</th>

                          <th className="p-3 text-left">Quantity</th>

                          <th className="p-3 text-left">Unit Cost</th>

                          <th className="p-3 text-left">Tax</th>

                          <th className="p-3 text-left">Subtotal</th>

                          <th className="p-3 text-left">Total</th>

                          {selectedOrder.status === "DRAFT" && (
                            <th className="p-3 text-left">Actions</th>
                          )}
                        </tr>
                      </thead>

                      <tbody>
                        {selectedOrder.items.length === 0 ? (
                          <tr>
                            <td
                              colSpan={selectedOrder.status === "DRAFT" ? 7 : 6}
                              className="p-8 text-center text-gray-500"
                            >
                              No items added yet.
                            </td>
                          </tr>
                        ) : (
                          selectedOrder.items.map((item) => (
                            <tr key={item.id} className="border-t">
                              <td className="p-3">{item.product}</td>

                              <td className="p-3">{item.quantity}</td>

                              <td className="p-3">{item.unit_cost}</td>

                              <td className="p-3">{item.tax_rate}%</td>

                              <td className="p-3">{item.subtotal}</td>

                              <td className="p-3 font-medium">{item.total}</td>

                              {selectedOrder.status === "DRAFT" && (
                                <td className="space-x-3 p-3">
                                  <button
                                    onClick={() => handleEditItem(item)}
                                    className="text-blue-600 hover:text-blue-800"
                                  >
                                    Edit
                                  </button>

                                  <button
                                    onClick={() => handleDeleteItem(item.id)}
                                    disabled={deletingItem}
                                    className="text-red-600 hover:text-red-800 disabled:opacity-50"
                                  >
                                    Delete
                                  </button>
                                </td>
                              )}
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* ================================================= */}
                {/* PO ACTIONS */}
                {/* ================================================= */}

                <div className="flex flex-wrap gap-3 border-t pt-5">
                  {selectedOrder.status === "DRAFT" && (
                    <button
                      onClick={handleConfirm}
                      disabled={confirmingOrder}
                      className="rounded-lg bg-blue-600 px-5 py-2.5 font-medium text-white disabled:opacity-50"
                    >
                      {confirmingOrder
                        ? "Confirming..."
                        : "Confirm Purchase Order"}
                    </button>
                  )}

                  {selectedOrder.status === "CONFIRMED" && (
                    <button
                      onClick={handleReceive}
                      disabled={receivingOrder}
                      className="rounded-lg bg-green-600 px-5 py-2.5 font-medium text-white disabled:opacity-50"
                    >
                      {receivingOrder
                        ? "Receiving..."
                        : "Receive Purchase Order"}
                    </button>
                  )}

                  {selectedOrder.status === "RECEIVED" && (
                    <div className="rounded-lg bg-green-50 px-5 py-2.5 font-medium text-green-700">
                      Purchase order received. Inventory has been updated.
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <p className="text-gray-500">Purchase order not found.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PurchasingPage;

import { useEffect, useState } from "react";

import { useGetCompaniesQuery } from "../companies/companyApi";

import { useGetWarehousesQuery } from "../warehouses/warehouseApi";

import { useGetProductsQuery } from "../products/productApi";

import {
  useCreateStockTransferMutation,
  useGetStockTransfersQuery,
} from "./stockTransferApi";

import type { CreateStockTransferRequest } from "./stockTransferTypes";
import { useGetBranchesQuery } from "../branches/branchApi";

const StockTransferPage = () => {
  const { data: companiesData, isLoading: companiesLoading } =
    useGetCompaniesQuery();

  const { data: branchesData, isLoading: branchesLoading } =
    useGetBranchesQuery();

  const { data: warehousesData, isLoading: warehousesLoading } =
    useGetWarehousesQuery();

  const { data: productsData, isLoading: productsLoading } =
    useGetProductsQuery();

  const { data: transfersData, isLoading: transfersLoading } =
    useGetStockTransfersQuery();

  const [createStockTransfer, { isLoading: isCreating }] =
    useCreateStockTransferMutation();

  // -----------------------------
  // Form state
  // -----------------------------

  const [companyId, setCompanyId] = useState<number | "">("");

  const [sourceBranchId, setSourceBranchId] = useState<number | "">("");

  const [destinationBranchId, setDestinationBranchId] = useState<number | "">(
    "",
  );

  const [fromWarehouseId, setFromWarehouseId] = useState<number | "">("");

  const [toWarehouseId, setToWarehouseId] = useState<number | "">("");

  const [productId, setProductId] = useState<number | "">("");

  const [quantity, setQuantity] = useState("");

  const [reference, setReference] = useState("");

  const [note, setNote] = useState("");

  const [error, setError] = useState("");

  const [success, setSuccess] = useState("");

  // -----------------------------
  // Data
  // -----------------------------

  const companies = companiesData?.companies ?? [];

  const branches = branchesData?.branches ?? [];

  const warehouses = warehousesData?.warehouses ?? [];

  const products = productsData?.products ?? [];

  const transfers = transfersData?.transfers ?? [];

  // -----------------------------
  // Branches belonging to company
  // -----------------------------

  const companyBranches =
    companyId === ""
      ? []
      : branches.filter((branch) => branch.company === companyId);

  // -----------------------------
  // Source warehouses
  // -----------------------------

  const sourceWarehouses =
    sourceBranchId === ""
      ? []
      : warehouses.filter((warehouse) => warehouse.branch === sourceBranchId);

  // -----------------------------
  // Destination warehouses
  // -----------------------------

  const destinationWarehouses =
    destinationBranchId === ""
      ? []
      : warehouses.filter(
          (warehouse) =>
            warehouse.branch === destinationBranchId &&
            warehouse.id !== fromWarehouseId,
        );

  // -----------------------------
  // Company changed
  // -----------------------------

  useEffect(() => {
    setSourceBranchId("");
    setDestinationBranchId("");

    setFromWarehouseId("");
    setToWarehouseId("");
  }, [companyId]);

  // -----------------------------
  // Source branch changed
  // -----------------------------

  useEffect(() => {
    setFromWarehouseId("");
  }, [sourceBranchId]);

  // -----------------------------
  // Destination branch changed
  // -----------------------------

  useEffect(() => {
    setToWarehouseId("");
  }, [destinationBranchId]);

  // -----------------------------
  // Submit
  // -----------------------------

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (
      companyId === "" ||
      sourceBranchId === "" ||
      destinationBranchId === "" ||
      fromWarehouseId === "" ||
      toWarehouseId === "" ||
      productId === ""
    ) {
      setError("Please select all required fields.");

      return;
    }

    if (fromWarehouseId === toWarehouseId) {
      setError("Source and destination warehouses must be different.");

      return;
    }

    if (!quantity || Number(quantity) <= 0) {
      setError("Quantity must be greater than zero.");

      return;
    }

    const data: CreateStockTransferRequest = {
      product: productId,

      from_warehouse: fromWarehouseId,

      to_warehouse: toWarehouseId,

      quantity,

      reference,

      note,
    };

    try {
      await createStockTransfer(data).unwrap();

      setSuccess("Stock transfer created successfully.");

      setFromWarehouseId("");
      setToWarehouseId("");
      setProductId("");
      setQuantity("");
      setReference("");
      setNote("");
    } catch (err: any) {
      setError(err?.data?.message || "Stock transfer failed.");
    }
  };

  const isLoading =
    companiesLoading || branchesLoading || warehousesLoading || productsLoading;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stock Transfers</h1>

      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-lg shadow mb-8"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Company */}

          <div>
            <label className="block mb-1 font-medium">Company</label>

            <select
              value={companyId}
              onChange={(event) =>
                setCompanyId(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
              className="w-full border rounded px-3 py-2"
              disabled={isLoading}
            >
              <option value="">Select Company</option>

              {companies.map((company) => (
                <option key={company.id} value={company.id}>
                  {company.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source Branch */}

          <div>
            <label className="block mb-1 font-medium">Source Branch</label>

            <select
              value={sourceBranchId}
              onChange={(event) =>
                setSourceBranchId(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
              className="w-full border rounded px-3 py-2"
              disabled={companyId === ""}
            >
              <option value="">Select Source Branch</option>

              {companyBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Source Warehouse */}

          <div>
            <label className="block mb-1 font-medium">Source Warehouse</label>

            <select
              value={fromWarehouseId}
              onChange={(event) =>
                setFromWarehouseId(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
              className="w-full border rounded px-3 py-2"
              disabled={sourceBranchId === ""}
            >
              <option value="">Select Source Warehouse</option>

              {sourceWarehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Branch */}

          <div>
            <label className="block mb-1 font-medium">Destination Branch</label>

            <select
              value={destinationBranchId}
              onChange={(event) =>
                setDestinationBranchId(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
              className="w-full border rounded px-3 py-2"
              disabled={companyId === ""}
            >
              <option value="">Select Destination Branch</option>

              {companyBranches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Destination Warehouse */}

          <div>
            <label className="block mb-1 font-medium">
              Destination Warehouse
            </label>

            <select
              value={toWarehouseId}
              onChange={(event) =>
                setToWarehouseId(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
              className="w-full border rounded px-3 py-2"
              disabled={destinationBranchId === ""}
            >
              <option value="">Select Destination Warehouse</option>

              {destinationWarehouses.map((warehouse) => (
                <option key={warehouse.id} value={warehouse.id}>
                  {warehouse.name}
                </option>
              ))}
            </select>
          </div>

          {/* Product */}

          <div>
            <label className="block mb-1 font-medium">Product</label>

            <select
              value={productId}
              onChange={(event) =>
                setProductId(
                  event.target.value ? Number(event.target.value) : "",
                )
              }
              className="w-full border rounded px-3 py-2"
            >
              <option value="">Select Product</option>

              {products.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.name} ({product.sku})
                </option>
              ))}
            </select>
          </div>

          {/* Quantity */}

          <div>
            <label className="block mb-1 font-medium">Quantity</label>

            <input
              type="number"
              min="0.01"
              step="0.01"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Enter quantity"
            />
          </div>

          {/* Reference */}

          <div>
            <label className="block mb-1 font-medium">Reference</label>

            <input
              type="text"
              value={reference}
              onChange={(event) => setReference(event.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="TRF-0002"
            />
          </div>

          {/* Note */}

          <div>
            <label className="block mb-1 font-medium">Note</label>

            <input
              type="text"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              className="w-full border rounded px-3 py-2"
              placeholder="Transfer note"
            />
          </div>
        </div>

        {/* Error */}

        {error && <p className="mt-4 text-red-600">{error}</p>}

        {/* Success */}

        {success && <p className="mt-4 text-green-600">{success}</p>}

        <button
          type="submit"
          disabled={isCreating}
          className="mt-6 bg-blue-600 text-white px-5 py-2 rounded"
        >
          {isCreating ? "Transferring..." : "Create Transfer"}
        </button>
      </form>

      {/* Transfer History */}

      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Transfer History</h2>

        {transfersLoading ? (
          <p>Loading transfers...</p>
        ) : transfers.length === 0 ? (
          <p>No stock transfers found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>

                  <th className="text-left p-3">From Warehouse</th>

                  <th className="text-left p-3">To Warehouse</th>

                  <th className="text-left p-3">Quantity</th>

                  <th className="text-left p-3">Reference</th>

                  <th className="text-left p-3">Date</th>
                </tr>
              </thead>

              <tbody>
                {transfers.map((transfer) => {
                  const product = products.find(
                    (item) => item.id === transfer.product,
                  );

                  const fromWarehouse = warehouses.find(
                    (item) => item.id === transfer.from_warehouse,
                  );

                  const toWarehouse = warehouses.find(
                    (item) => item.id === transfer.to_warehouse,
                  );

                  return (
                    <tr key={transfer.id} className="border-b">
                      <td className="p-3">
                        {product?.name || transfer.product}
                      </td>

                      <td className="p-3">
                        {fromWarehouse?.name || transfer.from_warehouse}
                      </td>

                      <td className="p-3">
                        {toWarehouse?.name || transfer.to_warehouse}
                      </td>

                      <td className="p-3">{transfer.quantity}</td>

                      <td className="p-3">{transfer.reference || "-"}</td>

                      <td className="p-3">
                        {new Date(transfer.created_at).toLocaleString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockTransferPage;

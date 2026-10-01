import { useState } from "react";

import {
  useGetStockMovementsQuery,
  useCreateStockMovementMutation,
} from "./stockMovementApi";

import type { StockMovementType } from "./stockMovementTypes";

import { useGetCompaniesQuery } from "../companies/companyApi";
import { useGetBranchesQuery } from "../branches/branchApi";
import { useGetWarehousesQuery } from "../warehouses/warehouseApi";
import { useGetProductsQuery } from "../products/productApi";

const StockMovementPage = () => {
  const { data: movementsData, isLoading: movementsLoading } =
    useGetStockMovementsQuery();

  const { data: companiesData } = useGetCompaniesQuery();

  const { data: branchesData } = useGetBranchesQuery();

  const { data: warehousesData } = useGetWarehousesQuery();

  const { data: productsData } = useGetProductsQuery();

  const [createStockMovement, { isLoading: isCreating }] =
    useCreateStockMovementMutation();

  const [company, setCompany] = useState("");

  const [branch, setBranch] = useState("");

  const [warehouse, setWarehouse] = useState("");

  const [product, setProduct] = useState("");

  const [movementType, setMovementType] =
    useState<StockMovementType>("PURCHASE");

  const [quantity, setQuantity] = useState("");

  const [reference, setReference] = useState("");

  const [note, setNote] = useState("");

  const companies = companiesData?.companies ?? [];

  const branches = branchesData?.branches ?? [];

  const warehouses = warehousesData?.warehouses ?? [];

  const products = productsData?.products ?? [];

  const movements = movementsData?.movements ?? [];

  const filteredBranches = branches.filter(
    (item) => item.company === Number(company),
  );

  const filteredWarehouses = warehouses.filter(
    (item) => item.branch === Number(branch),
  );

  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setCompany(value);
    setBranch("");
    setWarehouse("");
  };

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;

    setBranch(value);
    setWarehouse("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!product || !warehouse || !quantity) {
      alert("Please select product, warehouse and quantity.");

      return;
    }

    try {
      await createStockMovement({
        product: Number(product),
        warehouse: Number(warehouse),
        movement_type: movementType,
        quantity,
        reference,
        note,
      }).unwrap();

      setProduct("");
      setQuantity("");
      setReference("");
      setNote("");

      alert("Stock movement created successfully.");
    } catch (error) {
      console.error("Stock movement creation failed:", error);

      alert("Failed to create stock movement.");
    }
  };

  const getCompanyName = (branchId: number) => {
    const selectedBranch = branches.find((item) => item.id === branchId);

    const selectedCompany = companies.find(
      (item) => item.id === selectedBranch?.company,
    );

    return selectedCompany?.name ?? "-";
  };

  const getBranchName = (warehouseId: number) => {
    const selectedWarehouse = warehouses.find(
      (item) => item.id === warehouseId,
    );

    const selectedBranch = branches.find(
      (item) => item.id === selectedWarehouse?.branch,
    );

    return selectedBranch?.name ?? "-";
  };

  const getWarehouseName = (warehouseId: number) => {
    const warehouse = warehouses.find((item) => item.id === warehouseId);

    return warehouse?.name ?? "-";
  };

  const getProductName = (productId: number) => {
    const product = products.find((item) => item.id === productId);

    return product?.name ?? "-";
  };

  if (movementsLoading) {
    return <div>Loading stock movements...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Stock Movements</h1>

      {/* Create Movement */}

      <form onSubmit={handleSubmit} className="space-y-4 mb-8">
        {/* Company */}

        <div>
          <label>Company</label>

          <select
            value={company}
            onChange={handleCompanyChange}
            className="border p-2 w-full"
          >
            <option value="">Select Company</option>

            {companies.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Branch */}

        <div>
          <label>Branch</label>

          <select
            value={branch}
            onChange={handleBranchChange}
            disabled={!company}
            className="border p-2 w-full"
          >
            <option value="">Select Branch</option>

            {filteredBranches.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Warehouse */}

        <div>
          <label>Warehouse</label>

          <select
            value={warehouse}
            onChange={(event) => setWarehouse(event.target.value)}
            disabled={!branch}
            className="border p-2 w-full"
          >
            <option value="">Select Warehouse</option>

            {filteredWarehouses.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Product */}

        <div>
          <label>Product</label>

          <select
            value={product}
            onChange={(event) => setProduct(event.target.value)}
            className="border p-2 w-full"
          >
            <option value="">Select Product</option>

            {products.map((item) => (
              <option key={item.id} value={item.id}>
                {item.name} ({item.sku})
              </option>
            ))}
          </select>
        </div>

        {/* Movement Type */}

        <div>
          <label>Movement Type</label>

          <select
            value={movementType}
            onChange={(event) =>
              setMovementType(event.target.value as StockMovementType)
            }
            className="border p-2 w-full"
          >
            <option value="PURCHASE">Purchase</option>

            <option value="SALE">Sale</option>

            <option value="RETURN">Return</option>

            <option value="TRANSFER_IN">Transfer In</option>

            <option value="TRANSFER_OUT">Transfer Out</option>

            <option value="ADJUSTMENT">Adjustment</option>
          </select>
        </div>

        {/* Quantity */}

        <div>
          <label>Quantity</label>

          <input
            type="number"
            min="0.01"
            step="0.01"
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
            className="border p-2 w-full"
          />
        </div>

        {/* Reference */}

        <div>
          <label>Reference</label>

          <input
            type="text"
            value={reference}
            onChange={(event) => setReference(event.target.value)}
            placeholder="PO-003"
            className="border p-2 w-full"
          />
        </div>

        {/* Note */}

        <div>
          <label>Note</label>

          <textarea
            value={note}
            onChange={(event) => setNote(event.target.value)}
            className="border p-2 w-full"
          />
        </div>

        <button
          type="submit"
          disabled={isCreating}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          {isCreating ? "Creating..." : "Create Movement"}
        </button>
      </form>

      {/* Movement History */}

      <h2 className="text-xl font-semibold mb-4">Movement History</h2>

      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr>
              <th className="border p-2">Company</th>

              <th className="border p-2">Branch</th>

              <th className="border p-2">Warehouse</th>

              <th className="border p-2">Product</th>

              <th className="border p-2">Type</th>

              <th className="border p-2">Quantity</th>

              <th className="border p-2">Reference</th>

              <th className="border p-2">Date</th>
            </tr>
          </thead>

          <tbody>
            {movements.map((movement) => {
              const warehouse = warehouses.find(
                (item) => item.id === movement.warehouse,
              );

              return (
                <tr key={movement.id}>
                  <td className="border p-2">
                    {warehouse ? getCompanyName(warehouse.branch) : "-"}
                  </td>

                  <td className="border p-2">
                    {warehouse ? getBranchName(warehouse.id) : "-"}
                  </td>

                  <td className="border p-2">
                    {getWarehouseName(movement.warehouse)}
                  </td>

                  <td className="border p-2">
                    {getProductName(movement.product)}
                  </td>

                  <td className="border p-2">{movement.movement_type}</td>

                  <td className="border p-2">{movement.quantity}</td>

                  <td className="border p-2">{movement.reference || "-"}</td>

                  <td className="border p-2">
                    {new Date(movement.created_at).toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default StockMovementPage;

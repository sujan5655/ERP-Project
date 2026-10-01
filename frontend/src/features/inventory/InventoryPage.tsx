import { useState } from "react";

import {
  useCreateInventoryMutation,
  useDeleteInventoryMutation,
  useGetInventoriesQuery,
  useUpdateInventoryMutation,
} from "./inventoryApi";

import { useGetCompaniesQuery } from "../companies/companyApi";
import { useGetBranchesQuery } from "../branches/branchApi";
import { useGetWarehousesQuery } from "../warehouses/warehouseApi";

import { useGetProductsQuery } from "../products/productApi";

const InventoryPage = () => {
  // ==========================================
  // GET DATA
  // ==========================================

  const {
    data: inventoryData,
    isLoading: inventoriesLoading,
    isError: inventoriesError,
  } = useGetInventoriesQuery();

  const { data: companiesData } = useGetCompaniesQuery();

  const { data: branchesData } = useGetBranchesQuery();

  const { data: warehousesData } = useGetWarehousesQuery();

  const { data: productsData } = useGetProductsQuery();

  // ==========================================
  // MUTATIONS
  // ==========================================

  const [createInventory] = useCreateInventoryMutation();

  const [updateInventory] = useUpdateInventoryMutation();

  const [deleteInventory] = useDeleteInventoryMutation();

  // ==========================================
  // FORM STATE
  // ==========================================

  const [company, setCompany] = useState("");

  const [branch, setBranch] = useState("");

  const [warehouse, setWarehouse] = useState("");

  const [product, setProduct] = useState("");

  const [quantity, setQuantity] = useState("");

  const [reorderLevel, setReorderLevel] = useState("0");

  const [editingId, setEditingId] = useState<number | null>(null);

  // ==========================================
  // DATA
  // ==========================================

  const inventories = inventoryData?.inventories ?? [];

  const companies = companiesData?.companies ?? [];

  const branches = branchesData?.branches ?? [];

  const warehouses = warehousesData?.warehouses ?? [];

  const products = productsData?.products ?? [];

  // ==========================================
  // FILTER BRANCHES BY COMPANY
  // ==========================================

  const filteredBranches = branches.filter(
    (item) => item.company === Number(company),
  );

  // ==========================================
  // FILTER WAREHOUSES BY BRANCH
  // ==========================================

  const filteredWarehouses = warehouses.filter(
    (item) => item.branch === Number(branch),
  );

  // ==========================================
  // COMPANY CHANGE
  // ==========================================

  const handleCompanyChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCompany = event.target.value;

    setCompany(selectedCompany);

    // Reset dependent selections
    setBranch("");
    setWarehouse("");
  };

  // ==========================================
  // BRANCH CHANGE
  // ==========================================

  const handleBranchChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedBranch = event.target.value;

    setBranch(selectedBranch);

    // Reset dependent warehouse
    setWarehouse("");
  };

  // ==========================================
  // RESET FORM
  // ==========================================

  const resetForm = () => {
    setCompany("");
    setBranch("");
    setWarehouse("");
    setProduct("");
    setQuantity("");
    setReorderLevel("0");
    setEditingId(null);
  };

  // ==========================================
  // SUBMIT
  // ==========================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!company || !branch || !warehouse || !product || !quantity) {
      alert("Please fill in all required fields.");

      return;
    }

    const payload = {
      product: Number(product),
      warehouse: Number(warehouse),
      quantity,
      reorder_level: Number(reorderLevel),
    };

    try {
      if (editingId !== null) {
        await updateInventory({
          id: editingId,
          data: payload,
        }).unwrap();

        alert("Inventory updated successfully.");
      } else {
        await createInventory(payload).unwrap();

        alert("Inventory created successfully.");
      }

      resetForm();
    } catch (error) {
      console.error(error);

      alert("Inventory operation failed.");
    }
  };

  // ==========================================
  // EDIT
  // ==========================================

  const handleEdit = (inventory: (typeof inventories)[number]) => {
    const selectedWarehouse = warehouses.find(
      (item) => item.id === inventory.warehouse,
    );

    if (!selectedWarehouse) {
      alert("Warehouse information could not be found.");

      return;
    }

    const selectedBranch = branches.find(
      (item) => item.id === selectedWarehouse.branch,
    );

    if (!selectedBranch) {
      alert("Branch information could not be found.");

      return;
    }

    setEditingId(inventory.id);

    setCompany(String(selectedBranch.company));

    setBranch(String(selectedBranch.id));

    setWarehouse(String(inventory.warehouse));

    setProduct(String(inventory.product));

    setQuantity(inventory.quantity);

    setReorderLevel(String(inventory.reorder_level));
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this inventory record?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteInventory(id).unwrap();

      alert("Inventory deleted successfully.");

      if (editingId === id) {
        resetForm();
      }
    } catch (error) {
      console.error(error);

      alert("Failed to delete inventory.");
    }
  };

  // ==========================================
  // PRODUCT NAME
  // ==========================================

  const getProductName = (productId: number) => {
    const product = products.find((item) => item.id === productId);

    return product
      ? `${product.name} (${product.sku})`
      : `Product #${productId}`;
  };

  // ==========================================
  // WAREHOUSE NAME
  // ==========================================

  const getWarehouseName = (warehouseId: number) => {
    const warehouse = warehouses.find((item) => item.id === warehouseId);

    return warehouse
      ? `${warehouse.name} (${warehouse.code})`
      : `Warehouse #${warehouseId}`;
  };

  // ==========================================
  // BRANCH NAME
  // ==========================================

  const getBranchName = (warehouseId: number) => {
    const warehouse = warehouses.find((item) => item.id === warehouseId);

    if (!warehouse) {
      return `Branch unknown`;
    }

    const branch = branches.find((item) => item.id === warehouse.branch);

    return branch ? branch.name : `Branch #${warehouse.branch}`;
  };

  // ==========================================
  // COMPANY NAME
  // ==========================================

  const getCompanyName = (warehouseId: number) => {
    const warehouse = warehouses.find((item) => item.id === warehouseId);

    if (!warehouse) {
      return `Company unknown`;
    }

    const branch = branches.find((item) => item.id === warehouse.branch);

    if (!branch) {
      return `Company unknown`;
    }

    const company = companies.find((item) => item.id === branch.company);

    return company ? company.name : `Company #${branch.company}`;
  };

  // ==========================================
  // LOADING / ERROR
  // ==========================================

  if (inventoriesLoading) {
    return <div className="p-6">Loading inventory...</div>;
  }

  if (inventoriesError) {
    return <div className="p-6">Failed to load inventory.</div>;
  }

  // ==========================================
  // UI
  // ==========================================

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Inventory Management</h1>

      {/* ======================================
          FORM
      ====================================== */}

      <form onSubmit={handleSubmit} className="mb-8 rounded-lg border p-6">
        <h2 className="mb-4 text-xl font-semibold">
          {editingId !== null ? "Edit Inventory" : "Create Inventory"}
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          {/* COMPANY */}

          <div>
            <label className="mb-1 block font-medium">Company</label>

            <select
              value={company}
              onChange={handleCompanyChange}
              className="w-full rounded border p-2"
            >
              <option value="">Select company</option>

              {companies.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>

          {/* BRANCH */}

          <div>
            <label className="mb-1 block font-medium">Branch</label>

            <select
              value={branch}
              onChange={handleBranchChange}
              disabled={!company}
              className="w-full rounded border p-2 disabled:bg-gray-100"
            >
              <option value="">
                {company ? "Select branch" : "Select company first"}
              </option>

              {filteredBranches.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>

          {/* WAREHOUSE */}

          <div>
            <label className="mb-1 block font-medium">Warehouse</label>

            <select
              value={warehouse}
              onChange={(event) => setWarehouse(event.target.value)}
              disabled={!branch}
              className="w-full rounded border p-2 disabled:bg-gray-100"
            >
              <option value="">
                {branch ? "Select warehouse" : "Select branch first"}
              </option>

              {filteredWarehouses.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.code})
                </option>
              ))}
            </select>
          </div>

          {/* PRODUCT */}

          <div>
            <label className="mb-1 block font-medium">Product</label>

            <select
              value={product}
              onChange={(event) => setProduct(event.target.value)}
              className="w-full rounded border p-2"
            >
              <option value="">Select product</option>

              {products.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.name} ({item.sku})
                </option>
              ))}
            </select>
          </div>

          {/* QUANTITY */}

          <div>
            <label className="mb-1 block font-medium">Quantity</label>

            <input
              type="number"
              step="0.01"
              min="0"
              value={quantity}
              onChange={(event) => setQuantity(event.target.value)}
              className="w-full rounded border p-2"
              placeholder="Enter quantity"
            />
          </div>

          {/* REORDER LEVEL */}

          <div>
            <label className="mb-1 block font-medium">Reorder Level</label>

            <input
              type="number"
              min="0"
              value={reorderLevel}
              onChange={(event) => setReorderLevel(event.target.value)}
              className="w-full rounded border p-2"
              placeholder="Enter reorder level"
            />
          </div>
        </div>

        {/* BUTTONS */}

        <div className="mt-4 flex gap-3">
          <button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {editingId !== null ? "Update Inventory" : "Create Inventory"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded border px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* ======================================
          INVENTORY TABLE
      ====================================== */}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-100">
              <th className="p-3 text-left">ID</th>

              <th className="p-3 text-left">Company</th>

              <th className="p-3 text-left">Branch</th>

              <th className="p-3 text-left">Warehouse</th>

              <th className="p-3 text-left">Product</th>

              <th className="p-3 text-left">Quantity</th>

              <th className="p-3 text-left">Reorder Level</th>

              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {inventories.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-6 text-center">
                  No inventory records found.
                </td>
              </tr>
            ) : (
              inventories.map((inventory) => (
                <tr key={inventory.id} className="border-b">
                  <td className="p-3">{inventory.id}</td>

                  <td className="p-3">{getCompanyName(inventory.warehouse)}</td>

                  <td className="p-3">{getBranchName(inventory.warehouse)}</td>

                  <td className="p-3">
                    {getWarehouseName(inventory.warehouse)}
                  </td>

                  <td className="p-3">{getProductName(inventory.product)}</td>

                  <td className="p-3">{inventory.quantity}</td>

                  <td className="p-3">{inventory.reorder_level}</td>

                  <td className="p-3">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(inventory)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(inventory.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default InventoryPage;

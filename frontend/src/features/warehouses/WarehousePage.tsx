import { useState } from "react";

import {
  useCreateWarehouseMutation,
  useDeleteWarehouseMutation,
  useGetWarehousesQuery,
  useUpdateWarehouseMutation,
} from "./warehouseApi";

import { useGetBranchesQuery } from "../branches/branchApi";
import type { CreateWarehouseRequest, Warehouse } from "./types";

const initialForm: CreateWarehouseRequest = {
  branch: 0,
  name: "",
  code: "",
  address: "",
  manager_name: "",
  phone: "",
  capacity: "",
  is_active: true,
  photo: null,
};

const WarehousePage = () => {
  const { data, isLoading, isError } = useGetWarehousesQuery();
  const { data: branchesData } = useGetBranchesQuery();

  const [createWarehouse, { isLoading: isCreating }] =
    useCreateWarehouseMutation();

  const [updateWarehouse, { isLoading: isUpdating }] =
    useUpdateWarehouseMutation();

  const [deleteWarehouse] = useDeleteWarehouseMutation();

  const [form, setForm] = useState<CreateWarehouseRequest>(initialForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  // Controls modal visibility
  const [isModalOpen, setIsModalOpen] = useState(false);

  const warehouses = data?.warehouses ?? [];
  const branches = branchesData?.branches ?? [];

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "branch" ? Number(value) : value,
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setForm((previous) => ({
      ...previous,
      photo: file,
    }));
  };

  // Open empty form for creating
  const handleCreate = () => {
    setForm(initialForm);
    setEditingId(null);
    setIsModalOpen(true);
  };

  // Open form with warehouse data for editing
  const handleEdit = (warehouse: Warehouse) => {
    setEditingId(warehouse.id);

    setForm({
      branch: warehouse.branch,
      name: warehouse.name,
      code: warehouse.code,
      address: warehouse.address,
      manager_name: warehouse.manager_name,
      phone: warehouse.phone,
      capacity: warehouse.capacity ?? "",
      is_active: warehouse.is_active,
      photo: null,
    });

    setIsModalOpen(true);
  };

  // Close modal and reset form
  const handleCloseModal = () => {
    setForm(initialForm);
    setEditingId(null);
    setIsModalOpen(false);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.branch) {
      alert("Please select a branch.");
      return;
    }

    try {
      if (editingId) {
        await updateWarehouse({
          id: editingId,
          data: form,
        }).unwrap();

        alert("Warehouse updated successfully.");
      } else {
        await createWarehouse(form).unwrap();

        alert("Warehouse created successfully.");
      }

      handleCloseModal();
    } catch (error) {
      console.error(error);
      alert("Something went wrong.");
    }
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this warehouse?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteWarehouse(id).unwrap();

      alert("Warehouse deleted successfully.");
    } catch (error) {
      console.error(error);
      alert("Failed to delete warehouse.");
    }
  };

  if (isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <p className="text-gray-500">Loading warehouses...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-xl bg-red-50 p-6 text-red-600">
        Failed to load warehouses.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Warehouses</h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage your warehouses and storage locations
          </p>
        </div>

        {/* Create Button */}
        <button
          type="button"
          onClick={handleCreate}
          className="rounded-xl bg-blue-600 px-5 py-3 font-medium text-white shadow-sm transition hover:bg-blue-700"
        >
          + Create Warehouse
        </button>
      </div>

      {/* Warehouse List */}
      {warehouses.length === 0 ? (
        <div className="rounded-2xl border border-dashed bg-white p-12 text-center">
          <div className="mb-4 text-5xl">🏭</div>

          <h2 className="text-xl font-semibold text-gray-800">
            No warehouses found
          </h2>

          <p className="mt-2 text-gray-500">
            Create your first warehouse to get started.
          </p>

          <button
            type="button"
            onClick={handleCreate}
            className="mt-5 rounded-xl bg-blue-600 px-5 py-2.5 text-white hover:bg-blue-700"
          >
            + Create Warehouse
          </button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {warehouses.map((warehouse) => {
            const branch = branches.find(
              (item) => item.id === warehouse.branch,
            );

            return (
              <div
                key={warehouse.id}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Photo */}
                {warehouse.photo ? (
                  <img
                    src={`http://127.0.0.1:8000${warehouse.photo}`}
                    alt={warehouse.name}
                    className="h-48 w-full object-cover"
                  />
                ) : (
                  <div className="flex h-48 items-center justify-center bg-gray-100 text-5xl">
                    🏭
                  </div>
                )}

                {/* Content */}
                <div className="space-y-3 p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">
                        {warehouse.name}
                      </h3>

                      <p className="mt-1 text-sm text-gray-500">
                        {warehouse.code}
                      </p>
                    </div>

                    {/* Status */}
                    <span
                      className={`rounded-full px-2.5 py-1 text-xs font-medium ${
                        warehouse.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {warehouse.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  {/* Details */}
                  <div className="space-y-2 text-sm text-gray-600">
                    <p>
                      <span className="font-medium text-gray-800">Branch:</span>{" "}
                      {branch?.name ?? "Unknown"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Manager:
                      </span>{" "}
                      {warehouse.manager_name || "Not assigned"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">Phone:</span>{" "}
                      {warehouse.phone || "N/A"}
                    </p>

                    <p>
                      <span className="font-medium text-gray-800">
                        Capacity:
                      </span>{" "}
                      {warehouse.capacity ?? "N/A"}
                    </p>

                    {warehouse.address && (
                      <p>
                        <span className="font-medium text-gray-800">
                          Address:
                        </span>{" "}
                        {warehouse.address}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 border-t pt-4">
                    <button
                      type="button"
                      onClick={() => handleEdit(warehouse)}
                      className="flex-1 rounded-lg bg-yellow-500 px-3 py-2 text-sm font-medium text-white transition hover:bg-yellow-600"
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(warehouse.id)}
                      className="flex-1 rounded-lg bg-red-600 px-3 py-2 text-sm font-medium text-white transition hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
            {/* Modal Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {editingId ? "Edit Warehouse" : "Create Warehouse"}
                </h2>

                <p className="text-sm text-gray-500">
                  {editingId
                    ? "Update warehouse information"
                    : "Add a new warehouse"}
                </p>
              </div>

              <button
                type="button"
                onClick={handleCloseModal}
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-800"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 p-6">
              {/* Branch */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Branch
                </label>

                <select
                  name="branch"
                  value={form.branch}
                  onChange={handleChange}
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  required
                >
                  <option value={0}>Select Branch</option>

                  {branches.map((branch) => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Name + Code */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Warehouse Name
                  </label>

                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Main Warehouse"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Warehouse Code
                  </label>

                  <input
                    type="text"
                    name="code"
                    value={form.code}
                    onChange={handleChange}
                    placeholder="WH001"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                    required
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Address
                </label>

                <textarea
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Warehouse address"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Manager + Phone */}
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Manager Name
                  </label>

                  <input
                    type="text"
                    name="manager_name"
                    value={form.manager_name}
                    onChange={handleChange}
                    placeholder="Manager name"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>

                <div>
                  <label className="mb-1.5 block text-sm font-medium text-gray-700">
                    Phone
                  </label>

                  <input
                    type="text"
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="Phone number"
                    className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  />
                </div>
              </div>

              {/* Capacity */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Capacity
                </label>

                <input
                  type="number"
                  name="capacity"
                  value={form.capacity}
                  onChange={handleChange}
                  step="0.01"
                  min="0"
                  placeholder="1000"
                  className="w-full rounded-xl border border-gray-300 px-4 py-2.5 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                />
              </div>

              {/* Photo */}
              <div>
                <label className="mb-1.5 block text-sm font-medium text-gray-700">
                  Warehouse Photo
                </label>

                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="block w-full cursor-pointer rounded-xl border border-gray-300 p-2 text-sm"
                />
              </div>

              {/* Active */}
              <div className="flex items-center gap-3 rounded-xl bg-gray-50 p-4">
                <input
                  id="warehouse-active"
                  type="checkbox"
                  name="is_active"
                  checked={form.is_active}
                  onChange={(event) =>
                    setForm((previous) => ({
                      ...previous,
                      is_active: event.target.checked,
                    }))
                  }
                  className="h-4 w-4 rounded"
                />

                <label
                  htmlFor="warehouse-active"
                  className="text-sm font-medium text-gray-700"
                >
                  Warehouse is active
                </label>
              </div>

              {/* Buttons */}
              <div className="flex justify-end gap-3 border-t pt-5">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="rounded-xl border border-gray-300 px-5 py-2.5 font-medium text-gray-700 transition hover:bg-gray-100"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isCreating || isUpdating}
                  className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isCreating || isUpdating
                    ? "Saving..."
                    : editingId
                      ? "Update Warehouse"
                      : "Create Warehouse"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default WarehousePage;

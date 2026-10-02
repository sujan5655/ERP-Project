import { useState } from "react";

import {
  useGetSuppliersQuery,
  useCreateSupplierMutation,
  useUpdateSupplierMutation,
  useDeleteSupplierMutation,
} from "./supplierApi";

import type { Supplier, CreateSupplierRequest } from "./types";

const emptyForm: CreateSupplierRequest = {
  name: "",
  code: "",
  contact_person: "",
  email: "",
  phone: "",
  address: "",
  tax_number: "",
  payment_terms: "",
  is_active: true,
};

export default function SupplierPage() {
  const { data, isLoading, isError } = useGetSuppliersQuery();

  const [createSupplier] = useCreateSupplierMutation();

  const [updateSupplier] = useUpdateSupplierMutation();

  const [deleteSupplier] = useDeleteSupplierMutation();

  const [form, setForm] = useState<CreateSupplierRequest>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const suppliers = data?.suppliers ?? [];

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingId !== null) {
        await updateSupplier({
          id: editingId,
          data: form,
        }).unwrap();
      } else {
        await createSupplier(form).unwrap();
      }

      setForm(emptyForm);
      setEditingId(null);
    } catch (error) {
      console.error("Supplier operation failed:", error);
    }
  };

  const handleEdit = (supplier: Supplier) => {
    setEditingId(supplier.id);

    setForm({
      name: supplier.name,
      code: supplier.code,
      contact_person: supplier.contact_person,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      tax_number: supplier.tax_number,
      payment_terms: supplier.payment_terms,
      is_active: supplier.is_active,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this supplier?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteSupplier(id).unwrap();
    } catch (error) {
      console.error("Supplier deletion failed:", error);
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  if (isLoading) {
    return <div className="p-6">Loading suppliers...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load suppliers.</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Suppliers</h1>

        <p className="text-gray-600">Manage your suppliers.</p>
      </div>

      {/* Form */}

      <div className="rounded-lg border bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold">
          {editingId !== null ? "Edit Supplier" : "Create Supplier"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Supplier name"
            required
            className="rounded border p-2"
          />

          <input
            name="code"
            value={form.code}
            onChange={handleChange}
            placeholder="Supplier code"
            required
            className="rounded border p-2"
          />

          <input
            name="contact_person"
            value={form.contact_person}
            onChange={handleChange}
            placeholder="Contact person"
            className="rounded border p-2"
          />

          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="rounded border p-2"
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="rounded border p-2"
          />

          <input
            name="tax_number"
            value={form.tax_number}
            onChange={handleChange}
            placeholder="Tax number"
            className="rounded border p-2"
          />

          <input
            name="payment_terms"
            value={form.payment_terms}
            onChange={handleChange}
            placeholder="Payment terms"
            className="rounded border p-2"
          />

          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="rounded border p-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) =>
                setForm({
                  ...form,
                  is_active: e.target.checked,
                })
              }
            />
            Active supplier
          </label>

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              {editingId !== null ? "Update Supplier" : "Create Supplier"}
            </button>

            {editingId !== null && (
              <button
                type="button"
                onClick={handleCancelEdit}
                className="rounded border px-4 py-2"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Supplier List */}

      <div className="overflow-x-auto rounded-lg border bg-white">
        <table className="w-full">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Code</th>

              <th className="p-3 text-left">Contact</th>

              <th className="p-3 text-left">Phone</th>

              <th className="p-3 text-left">Status</th>

              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>

          <tbody>
            {suppliers.map((supplier) => (
              <tr key={supplier.id} className="border-b">
                <td className="p-3">{supplier.name}</td>

                <td className="p-3">{supplier.code}</td>

                <td className="p-3">{supplier.contact_person || "-"}</td>

                <td className="p-3">{supplier.phone || "-"}</td>

                <td className="p-3">
                  {supplier.is_active ? "Active" : "Inactive"}
                </td>

                <td className="p-3">
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="rounded border px-3 py-1"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {suppliers.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No suppliers found.
          </div>
        )}
      </div>
    </div>
  );
}

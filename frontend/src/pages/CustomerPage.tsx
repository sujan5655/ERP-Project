import { useState } from "react";

import {
  useGetCustomersQuery,
  useCreateCustomerMutation,
  useUpdateCustomerMutation,
  useDeleteCustomerMutation,
} from "../features/customers/customerApi";

import type {
  Customer,
  CreateCustomerRequest,
} from "../features/customers/types";

const emptyForm: CreateCustomerRequest = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  tax_number: "",
  is_active: true,
};

export default function CustomersPage() {
  const { data, isLoading, isError } = useGetCustomersQuery();

  const [createCustomer] = useCreateCustomerMutation();

  const [updateCustomer] = useUpdateCustomerMutation();

  const [deleteCustomer] = useDeleteCustomerMutation();

  const customers = data?.customers ?? [];

  const [form, setForm] = useState<CreateCustomerRequest>(emptyForm);

  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);

  const [message, setMessage] = useState("");

  const [error, setError] = useState("");

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage("");
    setError("");

    try {
      if (editingCustomer) {
        await updateCustomer({
          id: editingCustomer.id,
          body: form,
        }).unwrap();

        setMessage("Customer updated successfully.");
      } else {
        await createCustomer(form).unwrap();

        setMessage("Customer created successfully.");
      }

      setForm(emptyForm);
      setEditingCustomer(null);
    } catch (err: any) {
      setError(
        err?.data?.detail || err?.data?.message || "Something went wrong.",
      );
    }
  };

  const handleEdit = (customer: Customer) => {
    setEditingCustomer(customer);

    setForm({
      name: customer.name,
      code: customer.code,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      tax_number: customer.tax_number,
      is_active: customer.is_active,
    });

    setMessage("");
    setError("");
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this customer?")) {
      return;
    }

    setMessage("");
    setError("");

    try {
      await deleteCustomer(id).unwrap();

      setMessage("Customer deleted successfully.");
    } catch (err: any) {
      setError(
        err?.data?.detail || err?.data?.message || "Failed to delete customer.",
      );
    }
  };

  const handleCancel = () => {
    setEditingCustomer(null);
    setForm(emptyForm);
    setMessage("");
    setError("");
  };

  if (isLoading) {
    return <div className="p-6">Loading customers...</div>;
  }

  if (isError) {
    return <div className="p-6 text-red-600">Failed to load customers.</div>;
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-bold">Customers</h1>

        <p className="text-gray-600">Manage your customers.</p>
      </div>

      {message && (
        <div className="rounded bg-green-100 p-3 text-green-700">{message}</div>
      )}

      {error && (
        <div className="rounded bg-red-100 p-3 text-red-700">{error}</div>
      )}

      {/* FORM */}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">
          {editingCustomer ? "Edit Customer" : "Create Customer"}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 gap-4 md:grid-cols-2"
        >
          <input
            name="name"
            type="text"
            placeholder="Customer Name"
            value={form.name}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />

          <input
            name="code"
            type="text"
            placeholder="Customer Code"
            value={form.code}
            onChange={handleChange}
            className="rounded border p-2"
            required
          />

          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="rounded border p-2"
          />

          <input
            name="phone"
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={handleChange}
            className="rounded border p-2"
          />

          <input
            name="tax_number"
            type="text"
            placeholder="Tax Number"
            value={form.tax_number}
            onChange={handleChange}
            className="rounded border p-2"
          />

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(event) =>
                setForm((previous) => ({
                  ...previous,
                  is_active: event.target.checked,
                }))
              }
            />
            Active
          </label>

          <textarea
            name="address"
            placeholder="Address"
            value={form.address}
            onChange={handleChange}
            className="rounded border p-2 md:col-span-2"
            rows={3}
          />

          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              {editingCustomer ? "Update Customer" : "Create Customer"}
            </button>

            {editingCustomer && (
              <button
                type="button"
                onClick={handleCancel}
                className="rounded bg-gray-500 px-4 py-2 text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* CUSTOMER TABLE */}

      <div className="rounded-lg bg-white p-6 shadow">
        <h2 className="mb-4 text-lg font-semibold">Customer List</h2>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="p-3 text-left">Name</th>

                <th className="p-3 text-left">Code</th>

                <th className="p-3 text-left">Email</th>

                <th className="p-3 text-left">Phone</th>

                <th className="p-3 text-left">Status</th>

                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>

            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id} className="border-b">
                  <td className="p-3">{customer.name}</td>

                  <td className="p-3">{customer.code}</td>

                  <td className="p-3">{customer.email || "-"}</td>

                  <td className="p-3">{customer.phone || "-"}</td>

                  <td className="p-3">
                    {customer.is_active ? "Active" : "Inactive"}
                  </td>

                  <td className="space-x-2 p-3">
                    <button
                      onClick={() => handleEdit(customer)}
                      className="rounded bg-yellow-500 px-3 py-1 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(customer.id)}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

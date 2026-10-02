import { useEffect, useState } from "react";

import {
  useCreatePaymentMutation,
  useDeletePaymentMutation,
  useGetPaymentQuery,
  useGetPaymentsQuery,
  useUpdatePaymentMutation,
} from "../features/payments/paymentApi";

import type {
  CreatePaymentRequest,
  PaymentMethod,
  PaymentStatus,
} from "../features/payments/types";

import { useGetSalesOrdersQuery } from "../features/sales/salesApi";

const paymentMethods: PaymentMethod[] = [
  "CASH",
  "BANK_TRANSFER",
  "CARD",
  "ESEWA",
  "KHALTI",
  "OTHER",
];

const paymentStatuses: PaymentStatus[] = [
  "PENDING",
  "PAID",
  "PARTIAL",
  "FAILED",
  "REFUNDED",
  "CANCELLED",
];

const emptyForm: CreatePaymentRequest = {
  sales_order: 0,
  payment_number: "",
  amount: "",
  payment_method: "CASH",
  status: "PENDING",
  transaction_reference: "",
  payment_date: "",
  notes: "",
};

export default function PaymentsPage() {
  const {
    data: paymentsData,
    isLoading: paymentsLoading,
    error: paymentsError,
  } = useGetPaymentsQuery();

  const { data: salesOrdersData, isLoading: salesOrdersLoading } =
    useGetSalesOrdersQuery();

  const [createPayment, { isLoading: creating }] = useCreatePaymentMutation();

  const [updatePayment, { isLoading: updating }] = useUpdatePaymentMutation();

  const [deletePayment, { isLoading: deleting }] = useDeletePaymentMutation();

  const [selectedPaymentId, setSelectedPaymentId] = useState<number | null>(
    null,
  );

  const { data: selectedPaymentData } = useGetPaymentQuery(
    selectedPaymentId as number,
    {
      skip: selectedPaymentId === null,
    },
  );

  const [form, setForm] = useState<CreatePaymentRequest>(emptyForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const [message, setMessage] = useState("");

  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (selectedPaymentData?.payment) {
      const payment = selectedPaymentData.payment;

      setForm({
        sales_order: payment.sales_order,
        payment_number: payment.payment_number,
        amount: payment.amount,
        payment_method: payment.payment_method,
        status: payment.status,
        transaction_reference: payment.transaction_reference,
        payment_date: payment.payment_date
          ? payment.payment_date.slice(0, 16)
          : "",
        notes: payment.notes,
      });
    }
  }, [selectedPaymentData]);

  const payments = paymentsData?.payments ?? [];

  const salesOrders = salesOrdersData?.sales_orders ?? [];

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: name === "sales_order" ? Number(value) : value,
    }));
  };

  const resetForm = () => {
    setForm(emptyForm);

    setEditingId(null);

    setSelectedPaymentId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setMessage("");

    setErrorMessage("");

    if (!form.sales_order) {
      setErrorMessage("Please select a sales order.");

      return;
    }

    if (!form.payment_number.trim()) {
      setErrorMessage("Payment number is required.");

      return;
    }

    if (!form.amount || Number(form.amount) <= 0) {
      setErrorMessage("Payment amount must be greater than zero.");

      return;
    }

    try {
      if (editingId !== null) {
        await updatePayment({
          id: editingId,
          body: form,
        }).unwrap();

        setMessage("Payment updated successfully.");
      } else {
        await createPayment(form).unwrap();

        setMessage("Payment created successfully.");
      }

      resetForm();
    } catch (error: any) {
      setErrorMessage(
        error?.data?.errors
          ? JSON.stringify(error.data.errors)
          : "Something went wrong.",
      );
    }
  };

  const handleEdit = (paymentId: number) => {
    setEditingId(paymentId);

    setSelectedPaymentId(paymentId);

    setMessage("");

    setErrorMessage("");
  };

  const handleDelete = async (paymentId: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this payment?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deletePayment(paymentId).unwrap();

      setMessage("Payment deleted successfully.");

      if (selectedPaymentId === paymentId) {
        resetForm();
      }
    } catch (error: any) {
      setErrorMessage(error?.data?.message || "Failed to delete payment.");
    }
  };

  const selectedPayment = selectedPaymentData?.payment;

  if (paymentsLoading || salesOrdersLoading) {
    return <div className="p-6">Loading payments...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Payments</h1>

        <p className="text-gray-600">Manage sales order payments</p>
      </div>

      {message && (
        <div className="rounded bg-green-100 p-3 text-green-700">{message}</div>
      )}

      {errorMessage && (
        <div className="rounded bg-red-100 p-3 text-red-700">
          {errorMessage}
        </div>
      )}

      {paymentsError && (
        <div className="rounded bg-red-100 p-3 text-red-700">
          Failed to load payments.
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Form */}

        <div className="rounded-lg border bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">
            {editingId ? "Edit Payment" : "Create Payment"}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium">
                Sales Order
              </label>

              <select
                name="sales_order"
                value={form.sales_order}
                onChange={handleChange}
                className="w-full rounded border p-2"
              >
                <option value={0}>Select sales order</option>

                {salesOrders.map((order) => (
                  <option key={order.id} value={order.id}>
                    {order.order_number}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment Number
              </label>

              <input
                type="text"
                name="payment_number"
                value={form.payment_number}
                onChange={handleChange}
                placeholder="PAY-001"
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Amount</label>

              <input
                type="number"
                step="0.01"
                name="amount"
                value={form.amount}
                onChange={handleChange}
                placeholder="3000.00"
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment Method
              </label>

              <select
                name="payment_method"
                value={form.payment_method}
                onChange={handleChange}
                className="w-full rounded border p-2"
              >
                {paymentMethods.map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Status</label>

              <select
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded border p-2"
              >
                {paymentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Transaction Reference
              </label>

              <input
                type="text"
                name="transaction_reference"
                value={form.transaction_reference}
                onChange={handleChange}
                placeholder="TXN-001"
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">
                Payment Date
              </label>

              <input
                type="datetime-local"
                name="payment_date"
                value={form.payment_date}
                onChange={handleChange}
                className="w-full rounded border p-2"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium">Notes</label>

              <textarea
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows={3}
                className="w-full rounded border p-2"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                disabled={creating || updating}
                className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
              >
                {creating || updating
                  ? "Saving..."
                  : editingId
                    ? "Update Payment"
                    : "Create Payment"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="rounded bg-gray-500 px-4 py-2 text-white"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* Payment list */}

        <div className="rounded-lg border bg-white p-5 shadow lg:col-span-2">
          <h2 className="mb-4 text-lg font-semibold">Payment List</h2>

          {payments.length === 0 ? (
            <p className="text-gray-500">No payments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Payment</th>

                    <th className="p-3">Sales Order</th>

                    <th className="p-3">Amount</th>

                    <th className="p-3">Method</th>

                    <th className="p-3">Status</th>

                    <th className="p-3">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {payments.map((payment) => {
                    const order = salesOrders.find(
                      (item) => item.id === payment.sales_order,
                    );

                    return (
                      <tr key={payment.id} className="border-b">
                        <td className="p-3">{payment.payment_number}</td>

                        <td className="p-3">
                          {order?.order_number || payment.sales_order}
                        </td>

                        <td className="p-3">{payment.amount}</td>

                        <td className="p-3">{payment.payment_method}</td>

                        <td className="p-3">{payment.status}</td>

                        <td className="p-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleEdit(payment.id)}
                              className="rounded bg-yellow-500 px-3 py-1 text-white"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(payment.id)}
                              disabled={deleting}
                              className="rounded bg-red-600 px-3 py-1 text-white disabled:opacity-50"
                            >
                              Delete
                            </button>
                          </div>
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

      {/* Selected payment */}

      {selectedPayment && (
        <div className="rounded-lg border bg-white p-5 shadow">
          <h2 className="mb-4 text-lg font-semibold">Payment Details</h2>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm text-gray-500">Payment Number</p>

              <p className="font-medium">{selectedPayment.payment_number}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Amount</p>

              <p className="font-medium">{selectedPayment.amount}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Status</p>

              <p className="font-medium">{selectedPayment.status}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Method</p>

              <p className="font-medium">{selectedPayment.payment_method}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Transaction Reference</p>

              <p className="font-medium">
                {selectedPayment.transaction_reference || "-"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Sales Order</p>

              <p className="font-medium">{selectedPayment.sales_order}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

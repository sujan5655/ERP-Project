import { useState } from "react";

import {
  useGetBranchesQuery,
  useCreateBranchMutation,
  useUpdateBranchMutation,
  useDeleteBranchMutation,
} from "./branchApi";

import { useGetCompaniesQuery } from "../companies/companyApi";

const BranchPage = () => {
  const {
    data: branchesData,
    isLoading: isLoadingBranches,
    error: branchesError,
  } = useGetBranchesQuery();

  const { data: companiesData, isLoading: isLoadingCompanies } =
    useGetCompaniesQuery();

  const [createBranch, { isLoading: isCreating }] = useCreateBranchMutation();

  const [updateBranch, { isLoading: isUpdating }] = useUpdateBranchMutation();

  const [deleteBranch, { isLoading: isDeleting }] = useDeleteBranchMutation();

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);

  // null = create mode
  // number = edit mode
  const [editingBranchId, setEditingBranchId] = useState<number | null>(null);

  const [formData, setFormData] = useState({
    company: "",
    name: "",
    code: "",
    email: "",
    phone: "",
    address: "",
    photo: null as File | null,
  });

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  // -----------------------------
  // Open Create Modal
  // -----------------------------
  const handleCreate = () => {
    setEditingBranchId(null);

    setFormData({
      company: "",
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      photo: null,
    });

    setMessage("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // -----------------------------
  // Open Edit Modal
  // -----------------------------
  const handleEdit = (branch: any) => {
    setEditingBranchId(branch.id);

    setFormData({
      company: String(branch.company),
      name: branch.name,
      code: branch.code,
      email: branch.email || "",
      phone: branch.phone || "",
      address: branch.address || "",
      photo: null,
    });

    setMessage("");
    setErrorMessage("");
    setIsModalOpen(true);
  };

  // -----------------------------
  // Close Modal
  // -----------------------------
  const handleCloseModal = () => {
    if (isCreating || isUpdating) {
      return;
    }

    setIsModalOpen(false);
    setEditingBranchId(null);

    setFormData({
      company: "",
      name: "",
      code: "",
      email: "",
      phone: "",
      address: "",
      photo: null,
    });

    setMessage("");
    setErrorMessage("");
  };

  // -----------------------------
  // Input Change
  // -----------------------------
  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // -----------------------------
  // Photo Change
  // -----------------------------
  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setFormData((previous) => ({
      ...previous,
      photo: file,
    }));
  };

  // -----------------------------
  // Create / Update
  // -----------------------------
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    try {
      const requestData = {
        company: Number(formData.company),
        name: formData.name,
        code: formData.code,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        photo: formData.photo,
      };

      if (editingBranchId !== null) {
        const response = await updateBranch({
          id: editingBranchId,
          data: requestData,
        }).unwrap();

        setMessage(response.message);
      } else {
        const response = await createBranch(requestData).unwrap();

        setMessage(response.message);
      }

      // Close modal after successful operation
      setIsModalOpen(false);
      setEditingBranchId(null);

      setFormData({
        company: "",
        name: "",
        code: "",
        email: "",
        phone: "",
        address: "",
        photo: null,
      });
    } catch (error: any) {
      console.error(error);

      setErrorMessage(error?.data?.message || "Branch operation failed.");
    }
  };

  // -----------------------------
  // Delete
  // -----------------------------
  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this branch?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBranch(id).unwrap();

      setMessage("Branch deleted successfully.");
    } catch (error: any) {
      console.error(error);

      setErrorMessage(error?.data?.message || "Branch deletion failed.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ================= HEADER ================= */}
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Branches
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your company branches
            </p>
          </div>

          <button
            type="button"
            onClick={handleCreate}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700"
          >
            <span className="text-lg leading-none">+</span>
            Create Branch
          </button>
        </div>

        {/* ================= MESSAGES ================= */}

        {message && (
          <div className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">
            {message}
          </div>
        )}

        {errorMessage && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {errorMessage}
          </div>
        )}

        {/* ================= LOADING ================= */}

        {isLoadingBranches && (
          <div className="flex min-h-[300px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600" />

              <p className="text-sm text-slate-500">Loading branches...</p>
            </div>
          </div>
        )}

        {/* ================= ERROR ================= */}

        {branchesError && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-5 text-center">
            <p className="font-semibold text-red-700">
              Failed to load branches.
            </p>
          </div>
        )}

        {/* ================= EMPTY ================= */}

        {!isLoadingBranches &&
          !branchesError &&
          branchesData?.branches?.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50 text-3xl">
                🏢
              </div>

              <h2 className="text-xl font-bold text-slate-900">
                No branches found
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                You haven't created any branches yet. Click the button above to
                create your first branch.
              </p>

              <button
                type="button"
                onClick={handleCreate}
                className="mt-6 rounded-xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Create Your First Branch
              </button>
            </div>
          )}

        {/* ================= BRANCH GRID ================= */}

        {!isLoadingBranches &&
          branchesData?.branches &&
          branchesData.branches.length > 0 && (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
              {branchesData.branches.map((branch: any) => {
                const company = companiesData?.companies?.find(
                  (item: any) => item.id === branch.company,
                );

                return (
                  <div
                    key={branch.id}
                    className="group overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                  >
                    {/* Image */}
                    <div className="relative h-48 overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100">
                      {branch.photo ? (
                        <img
                          src={`http://127.0.0.1:8000${branch.photo}`}
                          alt={branch.name}
                          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <span className="text-6xl">🏢</span>
                        </div>
                      )}

                      {/* Code */}
                      <span className="absolute right-3 top-3 rounded-lg bg-white/90 px-3 py-1.5 text-xs font-bold text-indigo-700 shadow">
                        {branch.code}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <h3 className="text-xl font-bold text-slate-900">
                        {branch.name}
                      </h3>

                      <p className="mt-1 text-sm font-medium text-indigo-600">
                        {company?.name || "Unknown company"}
                      </p>

                      <div className="mt-5 space-y-3">
                        {branch.email && (
                          <div className="flex gap-3">
                            <span className="text-slate-400">✉</span>

                            <span className="truncate text-sm text-slate-600">
                              {branch.email}
                            </span>
                          </div>
                        )}

                        {branch.phone && (
                          <div className="flex gap-3">
                            <span className="text-slate-400">☎</span>

                            <span className="text-sm text-slate-600">
                              {branch.phone}
                            </span>
                          </div>
                        )}

                        {branch.address && (
                          <div className="flex gap-3">
                            <span className="text-slate-400">📍</span>

                            <span className="line-clamp-2 text-sm text-slate-600">
                              {branch.address}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="mt-5 flex gap-3 border-t border-slate-100 pt-4">
                        <button
                          type="button"
                          onClick={() => handleEdit(branch)}
                          className="flex-1 rounded-xl bg-indigo-50 px-4 py-2.5 text-sm font-semibold text-indigo-700 transition hover:bg-indigo-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(branch.id)}
                          disabled={isDeleting}
                          className="flex-1 rounded-xl bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-100 disabled:opacity-50"
                        >
                          {isDeleting ? "Deleting..." : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

        {/* ================================================= */}
        {/* CREATE / EDIT MODAL */}
        {/* ================================================= */}

        {isModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 py-6 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                handleCloseModal();
              }
            }}
          >
            <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl">
              {/* Modal Header */}
              <div className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-6 py-5">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">
                    {editingBranchId !== null ? "Edit Branch" : "Create Branch"}
                  </h2>

                  <p className="mt-1 text-sm text-slate-500">
                    {editingBranchId !== null
                      ? "Update branch information"
                      : "Add a new company branch"}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleCloseModal}
                  disabled={isCreating || isUpdating}
                  className="flex h-9 w-9 items-center justify-center rounded-lg text-xl text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
                >
                  ×
                </button>
              </div>

              {/* Modal Form */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Company */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Company
                    </label>

                    <select
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      disabled={isLoadingCompanies}
                      className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    >
                      <option value="">
                        {isLoadingCompanies
                          ? "Loading companies..."
                          : "Select Company"}
                      </option>

                      {companiesData?.companies?.map((company: any) => (
                        <option key={company.id} value={company.id}>
                          {company.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Name */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Branch Name
                    </label>

                    <input
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Branch name"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Code */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Branch Code
                    </label>

                    <input
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      placeholder="BR-001"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm uppercase outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Email */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Email
                    </label>

                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="branch@example.com"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Phone
                    </label>

                    <input
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>

                  {/* Photo */}
                  <div>
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Branch Photo
                    </label>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoChange}
                      className="w-full rounded-xl border border-slate-300 bg-white text-sm file:mr-4 file:border-0 file:bg-indigo-50 file:px-4 file:py-3 file:font-semibold file:text-indigo-600"
                    />
                  </div>

                  {/* Address */}
                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-semibold text-slate-700">
                      Address
                    </label>

                    <textarea
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Enter branch address..."
                      className="w-full resize-none rounded-xl border border-slate-300 px-4 py-3 text-sm outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100"
                    />
                  </div>
                </div>

                {/* Modal Buttons */}
                <div className="mt-6 flex justify-end gap-3 border-t border-slate-100 pt-5">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    disabled={isCreating || isUpdating}
                    className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:opacity-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    disabled={isCreating || isUpdating}
                    className="rounded-xl bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isCreating || isUpdating
                      ? "Saving..."
                      : editingBranchId !== null
                        ? "Update Branch"
                        : "Create Branch"}
                  </button>
                </div>

                {/* Modal Error */}
                {errorMessage && (
                  <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BranchPage;

import { useState } from "react";

import {
  useGetCompaniesQuery,
  useCreateCompanyMutation,
  useUpdateCompanyMutation,
  useDeleteCompanyMutation,
} from "./companyApi";

type Company = {
  id: number;
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  logo?: string | null;
};

type FormDataType = {
  name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  logo: File | null;
};

const emptyForm: FormDataType = {
  name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  logo: null,
};

const CompanyPage = () => {
  // ==========================================
  // API
  // ==========================================

  const { data, isLoading, error } = useGetCompaniesQuery();

  const [createCompany, { isLoading: isCreating }] = useCreateCompanyMutation();

  const [updateCompany, { isLoading: isUpdating }] = useUpdateCompanyMutation();

  const [deleteCompany, { isLoading: isDeleting }] = useDeleteCompanyMutation();

  // ==========================================
  // STATE
  // ==========================================

  const [formData, setFormData] = useState<FormDataType>(emptyForm);

  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [editingCompanyId, setEditingCompanyId] = useState<number | null>(null);

  const [editingCompany, setEditingCompany] = useState<Company | null>(null);

  // ==========================================
  // DERIVED STATE
  // ==========================================

  const isEditing = editingCompanyId !== null;

  const isSubmitting = isCreating || isUpdating;

  // ==========================================
  // TEXT INPUT CHANGE
  // ==========================================

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  // ==========================================
  // LOGO CHANGE
  // ==========================================

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null;

    setFormData((previous) => ({
      ...previous,
      logo: file,
    }));
  };

  // ==========================================
  // OPEN CREATE MODAL
  // ==========================================

  const openCreateModal = () => {
    setEditingCompanyId(null);
    setEditingCompany(null);

    setFormData({
      ...emptyForm,
    });

    setMessage("");
    setErrorMessage("");

    setIsModalOpen(true);
  };

  // ==========================================
  // OPEN EDIT MODAL
  // ==========================================

  const openEditModal = (company: Company) => {
    setEditingCompanyId(company.id);
    setEditingCompany(company);

    setFormData({
      name: company.name || "",
      code: company.code || "",
      email: company.email || "",
      phone: company.phone || "",
      address: company.address || "",
      logo: null,
    });

    setMessage("");
    setErrorMessage("");

    setIsModalOpen(true);
  };

  // ==========================================
  // CLOSE MODAL
  // ==========================================

  const closeModal = () => {
    if (isSubmitting) {
      return;
    }

    setIsModalOpen(false);

    setEditingCompanyId(null);

    setEditingCompany(null);

    setFormData({
      ...emptyForm,
    });

    setErrorMessage("");
  };

  // ==========================================
  // CREATE / UPDATE
  // ==========================================

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setMessage("");
    setErrorMessage("");

    // ========================================
    // CREATE MULTIPART FORM DATA
    // ========================================

    const payload = new FormData();

    payload.append("name", formData.name);
    payload.append("code", formData.code);
    payload.append("email", formData.email);
    payload.append("phone", formData.phone);
    payload.append("address", formData.address);

    if (formData.logo) {
      payload.append("logo", formData.logo);
    }

    try {
      // ======================================
      // UPDATE
      // ======================================

      if (editingCompanyId !== null) {
        const response = await updateCompany({
          id: editingCompanyId,
          data: payload,
        }).unwrap();

        setMessage(response.message || "Company updated successfully.");
      }

      // ======================================
      // CREATE
      // ======================================
      else {
        const response = await createCompany(payload).unwrap();

        setMessage(response.message || "Company created successfully.");
      }

      // ======================================
      // RESET
      // ======================================

      setIsModalOpen(false);

      setEditingCompanyId(null);

      setEditingCompany(null);

      setFormData({
        ...emptyForm,
      });
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.data?.message || error?.data?.detail || "Operation failed.",
      );
    }
  };

  // ==========================================
  // DELETE
  // ==========================================

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this company?",
    );

    if (!confirmed) {
      return;
    }

    setMessage("");
    setErrorMessage("");

    try {
      const response = await deleteCompany(id).unwrap();

      setMessage(response.message || "Company deleted successfully.");
    } catch (error: any) {
      console.error(error);

      setErrorMessage(
        error?.data?.message ||
          error?.data?.detail ||
          "Company deletion failed.",
      );
    }
  };

  // ==========================================
  // RENDER
  // ==========================================

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* ====================================
            PAGE HEADER
        ==================================== */}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Companies
            </h1>

            <p className="mt-1 text-sm text-slate-500">
              Manage your companies and organization information.
            </p>
          </div>

          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Add Company
          </button>
        </div>

        {/* ====================================
            SUCCESS MESSAGE
        ==================================== */}

        {message && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 font-bold">
              ✓
            </div>

            <p className="font-medium">{message}</p>
          </div>
        )}

        {/* ====================================
            ERROR MESSAGE
        ==================================== */}

        {errorMessage && !isModalOpen && (
          <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-red-100 font-bold">
              !
            </div>

            <p className="font-medium">{errorMessage}</p>
          </div>
        )}

        {/* ====================================
            COMPANY COUNT
        ==================================== */}

        {!isLoading && !error && data?.companies && (
          <div className="mb-5">
            <div className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-2 text-sm font-medium text-slate-600 shadow-sm ring-1 ring-slate-200">
              <span className="h-2 w-2 rounded-full bg-blue-500" />
              {data.companies.length}{" "}
              {data.companies.length === 1 ? "Company" : "Companies"}
            </div>
          </div>
        )}

        {/* ====================================
            LOADING
        ==================================== */}

        {isLoading && (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="animate-pulse rounded-xl bg-white p-6 shadow-sm ring-1 ring-slate-200"
              >
                <div className="mb-5 flex gap-3">
                  <div className="h-11 w-11 rounded-lg bg-slate-200" />

                  <div className="flex-1">
                    <div className="mb-2 h-4 w-2/3 rounded bg-slate-200" />
                    <div className="h-3 w-1/3 rounded bg-slate-200" />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="h-4 w-full rounded bg-slate-200" />
                  <div className="h-4 w-4/5 rounded bg-slate-200" />
                  <div className="h-4 w-3/5 rounded bg-slate-200" />
                </div>

                <div className="mt-6 h-10 rounded bg-slate-200" />
              </div>
            ))}
          </div>
        )}

        {/* ====================================
            API ERROR
        ==================================== */}

        {error && !isLoading && (
          <div className="rounded-xl border border-red-200 bg-white p-10 text-center shadow-sm">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-100 text-red-600">
              !
            </div>

            <h3 className="text-lg font-semibold text-slate-900">
              Unable to load companies
            </h3>

            <p className="mt-1 text-sm text-slate-500">
              Something went wrong while loading the company list.
            </p>
          </div>
        )}

        {/* ====================================
            EMPTY STATE
        ==================================== */}

        {!isLoading &&
          !error &&
          (!data?.companies || data.companies.length === 0) && (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center shadow-sm">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                >
                  <path d="M3 21h18" />

                  <path d="M5 21V5a2 2 0 012-2h10a2 2 0 012 2v16" />

                  <path d="M9 7h2" />
                  <path d="M13 7h2" />

                  <path d="M9 11h2" />
                  <path d="M13 11h2" />

                  <path d="M9 15h2" />
                  <path d="M13 15h2" />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                No companies yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
                Get started by creating your first company.
              </p>

              <button
                type="button"
                onClick={openCreateModal}
                className="mt-6 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Create Company
              </button>
            </div>
          )}

        {/* ====================================
            COMPANY CARDS
        ==================================== */}

        {!isLoading &&
          !error &&
          data?.companies &&
          data.companies.length > 0 && (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {data.companies.map((company: Company) => (
                <div
                  key={company.id}
                  className="group overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-200 hover:-translate-y-1 hover:shadow-lg"
                >
                  {/* CARD HEADER */}

                  <div className="border-b border-slate-100 p-5">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex min-w-0 items-center gap-3">
                        {/* LOGO */}

                        {company.logo ? (
                          <img
                            src={`http://localhost:8000/${company.logo}`}
                            alt={company.name}
                            className="h-12 w-12 shrink-0 rounded-xl object-cover ring-1 ring-slate-200"
                          />
                        ) : (
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 text-lg font-bold text-blue-700">
                            {company.name?.charAt(0)?.toUpperCase() || "C"}
                          </div>
                        )}

                        <div className="min-w-0">
                          <h3 className="truncate text-base font-semibold text-slate-900">
                            {company.name}
                          </h3>

                          <p className="mt-0.5 text-xs text-slate-500">
                            Company #{company.id}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                        {company.code}
                      </span>
                    </div>
                  </div>

                  {/* CARD BODY */}

                  <div className="space-y-4 p-5">
                    {/* EMAIL */}

                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 8l9 6 9-6M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Email
                        </p>

                        <p className="mt-1 truncate text-sm text-slate-700">
                          {company.email || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* PHONE */}

                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 5a2 2 0 012-2h2.28a2 2 0 011.94 1.515L10 8a2 2 0 01-.5 1.93l-1.27 1.27a16 16 0 006.57 6.57l1.27-1.27a2 2 0 011.93-.5l3.485.78A2 2 0 0123 18.72V21a2 2 0 01-2 2C10.163 23 1 13.837 1 3a2 2 0 012-2z"
                          />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Phone
                        </p>

                        <p className="mt-1 text-sm text-slate-700">
                          {company.phone || "Not provided"}
                        </p>
                      </div>
                    </div>

                    {/* ADDRESS */}

                    <div className="flex gap-3">
                      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.8"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M12 21s8-7.58 8-13a8 8 0 10-16 0c0 5.42 8 13 8 13z"
                          />

                          <circle cx="12" cy="8" r="2.5" />
                        </svg>
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
                          Address
                        </p>

                        <p className="mt-1 line-clamp-2 text-sm text-slate-700">
                          {company.address || "Not provided"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* CARD ACTIONS */}

                  <div className="flex border-t border-slate-100 bg-slate-50">
                    {/* EDIT */}

                    <button
                      type="button"
                      onClick={() => openEditModal(company)}
                      className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-blue-50 hover:text-blue-600"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M16.862 4.487l1.687-1.687a2.121 2.121 0 013 3l-9.193 9.193-3.75.75.75-3.75 7.506-7.506z"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h4"
                        />
                      </svg>
                      Edit
                    </button>

                    <div className="w-px bg-slate-200" />

                    {/* DELETE */}

                    <button
                      type="button"
                      onClick={() => handleDelete(company.id)}
                      disabled={isDeleting}
                      className="flex flex-1 items-center justify-center gap-2 px-4 py-3 text-sm font-medium text-slate-600 transition hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="1.8"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M6 7h12M10 11v6M14 11v6M9 7V4h6v3m-9 0l1 14h10l1-14"
                        />
                      </svg>

                      {isDeleting ? "Deleting..." : "Delete"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
      </div>

      {/* ======================================
          CREATE / EDIT MODAL
      ====================================== */}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal();
            }
          }}
        >
          <div className="w-full max-w-2xl overflow-hidden rounded-2xl bg-white shadow-2xl">
            {/* ================================
                MODAL HEADER
            ================================= */}

            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-5">
              <div>
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                    {isEditing ? (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth="2"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5"
                        />

                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"
                        />
                      </svg>
                    ) : (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                    )}
                  </div>

                  <div>
                    <h2 className="text-xl font-bold text-slate-900">
                      {isEditing ? "Edit Company" : "Create Company"}
                    </h2>

                    <p className="mt-0.5 text-sm text-slate-500">
                      {isEditing
                        ? "Update company information."
                        : "Add a new company."}
                    </p>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={isSubmitting}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:cursor-not-allowed"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* ================================
                FORM
            ================================= */}

            <form onSubmit={handleSubmit}>
              <div className="max-h-[70vh] overflow-y-auto px-6 py-6">
                {/* ERROR */}

                {errorMessage && (
                  <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
                    {errorMessage}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {/* NAME */}

                  <div>
                    <label
                      htmlFor="modal-name"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Company Name
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="modal-name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="Enter company name"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  {/* CODE */}

                  <div>
                    <label
                      htmlFor="modal-code"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Company Code
                      <span className="ml-1 text-red-500">*</span>
                    </label>

                    <input
                      id="modal-code"
                      name="code"
                      value={formData.code}
                      onChange={handleChange}
                      required
                      placeholder="e.g. ABC001"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  {/* EMAIL */}

                  <div>
                    <label
                      htmlFor="modal-email"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Email
                    </label>

                    <input
                      id="modal-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="company@example.com"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  {/* PHONE */}

                  <div>
                    <label
                      htmlFor="modal-phone"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Phone
                    </label>

                    <input
                      id="modal-phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="Enter phone number"
                      className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  {/* ADDRESS */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="modal-address"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Address
                    </label>

                    <textarea
                      id="modal-address"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      rows={3}
                      placeholder="Enter company address"
                      className="w-full resize-none rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-50"
                    />
                  </div>

                  {/* LOGO */}

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="modal-logo"
                      className="mb-2 block text-sm font-medium text-slate-700"
                    >
                      Company Logo
                    </label>

                    {/* CURRENT LOGO */}

                    {isEditing && editingCompany?.logo && (
                      <div className="mb-4 flex items-center gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                        <img
                          src={editingCompany.logo}
                          alt={editingCompany.name}
                          className="h-20 w-20 rounded-xl object-cover ring-1 ring-slate-200"
                        />

                        <div>
                          <p className="text-sm font-semibold text-slate-800">
                            Current Logo
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            Select a new image below to replace it.
                          </p>
                        </div>
                      </div>
                    )}

                    <input
                      id="modal-logo"
                      type="file"
                      name="logo"
                      accept="image/png,image/jpeg,image/jpg,image/webp"
                      onChange={handleLogoChange}
                      className="block w-full cursor-pointer rounded-lg border border-slate-300 bg-white text-sm text-slate-700 file:mr-4 file:border-0 file:bg-blue-50 file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-blue-700 hover:file:bg-blue-100"
                    />

                    {/* NEW FILE */}

                    {formData.logo && (
                      <div className="mt-3 flex items-center gap-3 rounded-lg bg-blue-50 p-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                          ✓
                        </div>

                        <div className="min-w-0">
                          <p className="text-xs font-medium text-blue-700">
                            New logo selected
                          </p>

                          <p className="truncate text-xs text-blue-600">
                            {formData.logo.name}
                          </p>
                        </div>
                      </div>
                    )}

                    <p className="mt-2 text-xs text-slate-400">
                      PNG, JPG, JPEG or WEBP. Recommended square image.
                    </p>
                  </div>
                </div>
              </div>

              {/* ================================
                  FOOTER
              ================================= */}

              <div className="flex flex-col-reverse gap-3 border-t border-slate-200 bg-slate-50 px-6 py-4 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={isSubmitting}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {isSubmitting && (
                    <svg
                      className="h-4 w-4 animate-spin"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />

                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                  )}

                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                      ? "Update Company"
                      : "Create Company"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyPage;

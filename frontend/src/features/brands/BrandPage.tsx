import { useState } from "react";

import {
  useCreateBrandMutation,
  useDeleteBrandMutation,
  useGetBrandsQuery,
  useUpdateBrandMutation,
} from "./brandApi";

import type { Brand, CreateBrandRequest } from "./types";

const initialForm: CreateBrandRequest = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
  logo: null,
};

const BrandPage = () => {
  const { data, isLoading, isError } = useGetBrandsQuery();

  const [createBrand, { isLoading: isCreating }] = useCreateBrandMutation();

  const [updateBrand, { isLoading: isUpdating }] = useUpdateBrandMutation();

  const [deleteBrand] = useDeleteBrandMutation();

  const [form, setForm] = useState<CreateBrandRequest>(initialForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const brands = data?.brands ?? [];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setForm((previous) => ({
      ...previous,
      logo: file,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      if (editingId) {
        await updateBrand({
          id: editingId,
          data: form,
        }).unwrap();

        alert("Brand updated successfully.");
      } else {
        await createBrand(form).unwrap();

        alert("Brand created successfully.");
      }

      resetForm();
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);

    setForm({
      name: brand.name,
      slug: brand.slug,
      description: brand.description,
      is_active: brand.is_active,
      logo: null,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this brand?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteBrand(id).unwrap();

      alert("Brand deleted successfully.");
    } catch (error) {
      console.error(error);

      alert("Failed to delete brand.");
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading brands...</div>;
  }

  if (isError) {
    return <div className="p-6">Failed to load brands.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Brands</h1>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="mb-8 max-w-2xl space-y-4 rounded-lg border p-6"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Brand" : "Create Brand"}
        </h2>

        {/* Name */}

        <div>
          <label className="mb-1 block">Brand Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="Samsung"
            required
          />
        </div>

        {/* Slug */}

        <div>
          <label className="mb-1 block">Slug</label>

          <input
            type="text"
            name="slug"
            value={form.slug}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="samsung"
            required
          />
        </div>

        {/* Description */}

        <div>
          <label className="mb-1 block">Description</label>

          <textarea
            name="description"
            value={form.description}
            onChange={handleChange}
            className="w-full rounded border p-2"
            rows={4}
          />
        </div>

        {/* Logo */}

        <div>
          <label className="mb-1 block">Brand Logo</label>

          <input type="file" accept="image/*" onChange={handleLogoChange} />
        </div>

        {/* Active */}

        <div className="flex items-center gap-2">
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

          <label>Active</label>
        </div>

        {/* Buttons */}

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={isCreating || isUpdating}
            className="rounded bg-blue-600 px-4 py-2 text-white"
          >
            {isCreating || isUpdating
              ? "Saving..."
              : editingId
                ? "Update Brand"
                : "Create Brand"}
          </button>

          {editingId && (
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

      {/* Brand List */}

      <div>
        <h2 className="mb-4 text-xl font-semibold">Brand List</h2>

        {brands.length === 0 ? (
          <p>No brands found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {brands.map((brand) => (
              <div key={brand.id} className="overflow-hidden rounded-lg border">
                {brand.logo && (
                  <img
                    src={`http://127.0.0.1:8000${brand.logo}`}
                    alt={brand.name}
                    className="h-48 w-full object-contain p-4"
                  />
                )}

                <div className="space-y-2 p-4">
                  <h3 className="text-lg font-semibold">{brand.name}</h3>

                  <p>
                    <strong>Slug:</strong> {brand.slug}
                  </p>

                  <p>{brand.description || "No description"}</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {brand.is_active ? "Active" : "Inactive"}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(brand)}
                      className="rounded bg-yellow-500 px-3 py-1 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(brand.id)}
                      className="rounded bg-red-600 px-3 py-1 text-white"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandPage;

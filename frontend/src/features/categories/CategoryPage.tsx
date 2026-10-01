import { useState } from "react";

import {
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetCategoriesQuery,
  useUpdateCategoryMutation,
} from "./categoryApi";

import type { Category, CreateCategoryRequest } from "./types";

const initialForm: CreateCategoryRequest = {
  name: "",
  slug: "",
  description: "",
  is_active: true,
  image: null,
};

const CategoryPage = () => {
  const { data, isLoading, isError } = useGetCategoriesQuery();

  const [createCategory, { isLoading: isCreating }] =
    useCreateCategoryMutation();

  const [updateCategory, { isLoading: isUpdating }] =
    useUpdateCategoryMutation();

  const [deleteCategory] = useDeleteCategoryMutation();

  const [form, setForm] = useState<CreateCategoryRequest>(initialForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const categories = data?.categories ?? [];

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setForm((previous) => ({
      ...previous,
      image: file,
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
        await updateCategory({
          id: editingId,
          data: form,
        }).unwrap();

        alert("Category updated successfully.");
      } else {
        await createCategory(form).unwrap();

        alert("Category created successfully.");
      }

      resetForm();
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);

    setForm({
      name: category.name,
      slug: category.slug,
      description: category.description,
      is_active: category.is_active,
      image: null,
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this category?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteCategory(id).unwrap();

      alert("Category deleted successfully.");
    } catch (error) {
      console.error(error);

      alert("Failed to delete category.");
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading categories...</div>;
  }

  if (isError) {
    return <div className="p-6">Failed to load categories.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Categories</h1>

      {/* Form */}

      <form
        onSubmit={handleSubmit}
        className="mb-8 max-w-2xl space-y-4 rounded-lg border p-6"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Category" : "Create Category"}
        </h2>

        {/* Name */}

        <div>
          <label className="mb-1 block">Category Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="Electronics"
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
            placeholder="electronics"
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

        {/* Image */}

        <div>
          <label className="mb-1 block">Category Image</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />
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
                ? "Update Category"
                : "Create Category"}
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

      {/* Category List */}

      <div>
        <h2 className="mb-4 text-xl font-semibold">Category List</h2>

        {categories.length === 0 ? (
          <p>No categories found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {categories.map((category) => (
              <div
                key={category.id}
                className="overflow-hidden rounded-lg border"
              >
                {category.image && (
                  <img
                    src={`http://127.0.0.1:8000${category.image}`}
                    alt={category.name}
                    className="h-48 w-full object-cover"
                  />
                )}

                <div className="space-y-2 p-4">
                  <h3 className="text-lg font-semibold">{category.name}</h3>

                  <p>
                    <strong>Slug:</strong> {category.slug}
                  </p>

                  <p>{category.description || "No description"}</p>

                  <p>
                    <strong>Status:</strong>{" "}
                    {category.is_active ? "Active" : "Inactive"}
                  </p>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={() => handleEdit(category)}
                      className="rounded bg-yellow-500 px-3 py-1 text-white"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(category.id)}
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

export default CategoryPage;

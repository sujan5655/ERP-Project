import { useState } from "react";

import {
  useCreateProductMutation,
  useDeleteProductMutation,
  useGetProductsQuery,
  useUpdateProductMutation,
} from "./productApi";

import { useGetCategoriesQuery } from "../categories/categoryApi";
import { useGetBrandsQuery } from "../brands/brandApi";

import type { Product, CreateProductRequest } from "./types";

const initialForm: CreateProductRequest = {
  category: 0,
  brand: null,
  name: "",
  sku: "",
  description: "",
  cost_price: "",
  selling_price: "",
  tax_rate: "0",
  reorder_level: 0,
  unit: "piece",
  is_active: true,
  image: null,
};

const ProductPage = () => {
  const { data, isLoading, isError } = useGetProductsQuery();

  const { data: categoryData } = useGetCategoriesQuery();

  const { data: brandData } = useGetBrandsQuery();

  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();

  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  const [deleteProduct] = useDeleteProductMutation();

  const [form, setForm] = useState<CreateProductRequest>(initialForm);

  const [editingId, setEditingId] = useState<number | null>(null);

  const products = data?.products ?? [];

  const categories = categoryData?.categories ?? [];

  const brands = brandData?.brands ?? [];

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]:
        name === "category"
          ? Number(value)
          : name === "brand"
            ? value === ""
              ? null
              : Number(value)
            : name === "reorder_level"
              ? Number(value)
              : value,
    }));
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;

    setForm((previous) => ({
      ...previous,
      image: file,
    }));
  };

  const handleActiveChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setForm((previous) => ({
      ...previous,
      is_active: event.target.checked,
    }));
  };

  const resetForm = () => {
    setForm(initialForm);
    setEditingId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!form.category) {
      alert("Please select a category.");

      return;
    }

    try {
      if (editingId) {
        await updateProduct({
          id: editingId,
          data: form,
        }).unwrap();

        alert("Product updated successfully.");
      } else {
        await createProduct(form).unwrap();

        alert("Product created successfully.");
      }

      resetForm();
    } catch (error) {
      console.error(error);

      alert("Something went wrong.");
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id);

    setForm({
      category: product.category,

      brand: product.brand,

      name: product.name,

      sku: product.sku,

      description: product.description,

      cost_price: product.cost_price,

      selling_price: product.selling_price,

      tax_rate: product.tax_rate,

      reorder_level: product.reorder_level,

      unit: product.unit,

      is_active: product.is_active,

      image: null,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProduct(id).unwrap();

      alert("Product deleted successfully.");
    } catch (error) {
      console.error(error);

      alert("Failed to delete product.");
    }
  };

  if (isLoading) {
    return <div className="p-6">Loading products...</div>;
  }

  if (isError) {
    return <div className="p-6">Failed to load products.</div>;
  }

  return (
    <div className="p-6">
      <h1 className="mb-6 text-2xl font-bold">Products</h1>

      <form
        onSubmit={handleSubmit}
        className="mb-8 max-w-3xl space-y-4 rounded-lg border p-6"
      >
        <h2 className="text-xl font-semibold">
          {editingId ? "Edit Product" : "Create Product"}
        </h2>

        {/* Category */}

        <div>
          <label className="mb-1 block">Category</label>

          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className="w-full rounded border p-2"
            required
          >
            <option value={0}>Select Category</option>

            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* Brand */}

        <div>
          <label className="mb-1 block">Brand</label>

          <select
            name="brand"
            value={form.brand ?? ""}
            onChange={handleChange}
            className="w-full rounded border p-2"
          >
            <option value="">No Brand</option>

            {brands.map((brand) => (
              <option key={brand.id} value={brand.id}>
                {brand.name}
              </option>
            ))}
          </select>
        </div>

        {/* Name */}

        <div>
          <label className="mb-1 block">Product Name</label>

          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="Samsung Galaxy S25"
            required
          />
        </div>

        {/* SKU */}

        <div>
          <label className="mb-1 block">SKU</label>

          <input
            type="text"
            name="sku"
            value={form.sku}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="SAM-S25-001"
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

        {/* Cost Price */}

        <div>
          <label className="mb-1 block">Cost Price</label>

          <input
            type="number"
            name="cost_price"
            value={form.cost_price}
            onChange={handleChange}
            className="w-full rounded border p-2"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Selling Price */}

        <div>
          <label className="mb-1 block">Selling Price</label>

          <input
            type="number"
            name="selling_price"
            value={form.selling_price}
            onChange={handleChange}
            className="w-full rounded border p-2"
            min="0"
            step="0.01"
            required
          />
        </div>

        {/* Tax */}

        <div>
          <label className="mb-1 block">Tax Rate (%)</label>

          <input
            type="number"
            name="tax_rate"
            value={form.tax_rate}
            onChange={handleChange}
            className="w-full rounded border p-2"
            min="0"
            step="0.01"
          />
        </div>

        {/* Reorder Level */}

        <div>
          <label className="mb-1 block">Reorder Level</label>

          <input
            type="number"
            name="reorder_level"
            value={form.reorder_level}
            onChange={handleChange}
            className="w-full rounded border p-2"
            min="0"
          />
        </div>

        {/* Unit */}

        <div>
          <label className="mb-1 block">Unit</label>

          <input
            type="text"
            name="unit"
            value={form.unit}
            onChange={handleChange}
            className="w-full rounded border p-2"
            placeholder="piece"
            required
          />
        </div>

        {/* Image */}

        <div>
          <label className="mb-1 block">Product Image</label>

          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        {/* Active */}

        <div className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={form.is_active}
            onChange={handleActiveChange}
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
                ? "Update Product"
                : "Create Product"}
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

      {/* Product List */}

      <div>
        <h2 className="mb-4 text-xl font-semibold">Product List</h2>

        {products.length === 0 ? (
          <p>No products found.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => {
              const category = categories.find(
                (item) => item.id === product.category,
              );

              const brand = brands.find((item) => item.id === product.brand);

              return (
                <div
                  key={product.id}
                  className="overflow-hidden rounded-lg border"
                >
                  {product.image && (
                    <img
                      src={`http://127.0.0.1:8000${product.image}`}
                      alt={product.name}
                      className="h-48 w-full object-contain p-4"
                    />
                  )}

                  <div className="space-y-2 p-4">
                    <h3 className="text-lg font-semibold">{product.name}</h3>

                    <p>
                      <strong>SKU:</strong> {product.sku}
                    </p>

                    <p>
                      <strong>Category:</strong> {category?.name ?? "Unknown"}
                    </p>

                    <p>
                      <strong>Brand:</strong> {brand?.name ?? "No Brand"}
                    </p>

                    <p>
                      <strong>Cost:</strong> {product.cost_price}
                    </p>

                    <p>
                      <strong>Selling Price:</strong> {product.selling_price}
                    </p>

                    <p>
                      <strong>Tax:</strong> {product.tax_rate}%
                    </p>

                    <p>
                      <strong>Reorder Level:</strong> {product.reorder_level}
                    </p>

                    <p>
                      <strong>Status:</strong>{" "}
                      {product.is_active ? "Active" : "Inactive"}
                    </p>

                    <div className="flex gap-2 pt-2">
                      <button
                        onClick={() => handleEdit(product)}
                        className="rounded bg-yellow-500 px-3 py-1 text-white"
                      >
                        Edit
                      </button>

                      <button
                        onClick={() => handleDelete(product.id)}
                        className="rounded bg-red-600 px-3 py-1 text-white"
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
      </div>
    </div>
  );
};

export default ProductPage;

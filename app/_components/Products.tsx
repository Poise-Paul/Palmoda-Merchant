"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { FaTshirt } from "react-icons/fa";
import { deleteProduct } from "../_lib/product";
import { toast } from "react-toastify";


interface ProductType {
  _id: string;
  name: string;
  discounted_price: number;
  status: string;
  quantity: number;
 images: string[];
}

interface ProductsProps {
  products: ProductType[];
  setProducts: React.Dispatch<React.SetStateAction<ProductType[]>>;
}

function Products({ products, setProducts }: ProductsProps) {
  const [filter, setFilter] = useState<string>("All");
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  // FIX: Map backend status to UI status style
  const formatStatus = (status: string): string => {
    if (status === "Approved") return "APPROVED";
    if (status === "Pending Review") return "PENDING";
    if (status === "Rejected") return "REJECTED";
    return status?.toUpperCase() || "UNKNOWN";
  };

  // Filter items
  const filteredProducts =
    filter === "All"
      ? products
      : products.filter((p) => formatStatus(p.status) === filter);

  const statuses = ["All", "LIVE", "PENDING", "APPROVED", "REJECTED"];

  const handleDelete = async (id: string) => {
  try {
    setIsDeleting(true);
    const toastId = toast.loading("Deleting product...");

    const res = await deleteProduct(id);
    console.log(res);
    if (res.success) {
      // Remove deleted product from local state
      setProducts(prev => prev.filter(p => p._id !== id));

      toast.update(toastId, {
        render: "Product deleted successfully",
        type: "success",
        isLoading: false,
        autoClose: 3000,
      });
    } else {
      toast.update(toastId, {
        render: res.message || "Failed to delete product",
        type: "error",
        isLoading: false,
        autoClose: 3000,
      });
    }
  } catch (error) {
    toast.error("Something went wrong while deleting product");
  } finally {
    setIsDeleting(false);
  }
};


  return (
    <div className="w-full  px-4 py-2 bg-white rounded-md shadow-sm border border-gray-200">

      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-black text-lg">Product Status</h2>
        <div className="flex gap-2">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm px-3 py-1 rounded-md border ${
                filter === s
                  ? "bg-black text-white"
                  : "bg-white text-gray-700 border-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700 text-left">
              <th className="p-3">Product</th>
              <th className="p-3">Price</th>
              <th className="p-3">Status</th>
              <th className="p-3">Inventory</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product._id}
              onClick={() => router.push(`/edit-product/${product._id}`)}
              className="hover:bg-gray-50 cursor-pointer transition-colors">

                <td className="p-3 flex items-center gap-2">
                  <img src={product.images?.[0]} className="w-[30px]" alt={product.name} />
                  <span className="text-black">{product.name}</span>
                </td>

                <td className="p-3">
                  ₦{product.discounted_price?.toLocaleString()}
                </td>

                <td
                  className={`p-3 font-semibold ${
                    formatStatus(product.status) === "LIVE"
                      ? "text-green-600"
                      : formatStatus(product.status) === "PENDING"
                      ? "text-yellow-600"
                      : formatStatus(product.status) === "APPROVED"
                      ? "text-blue-600"
                      : "text-red-600"
                  }`}
                >
                  {formatStatus(product.status)}
                </td>

                <td className="p-3 text-gray-700">
                  {product.quantity} units
                </td>
                <td className="p-3">
        <div className="flex gap-2">
          <Link
            href={`/edit-product/${product._id}`}
            className="px-3 py-1 text-xs bg-inherit text-black border border-black uppercase"
          >
            Edit
          </Link>

          <button
            onClick={(e) => {
    e.stopPropagation(); // Prevent row click redirect
    handleDelete(product._id);
  }}
            className="px-3 py-1 text-xs text-white bg-black uppercase"
          >
            Delete
          </button>
        </div>
      </td>
              </tr>

            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <p className="text-sm text-gray-600 mt-3">
        Showing {filteredProducts.length} of {products.length} products
      </p>
    </div>
  );
}

export default Products;

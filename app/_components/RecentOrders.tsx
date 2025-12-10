"use client";
import React from "react";
import { useOrdersList } from "../_lib/useOrders";
import Link from "next/link";

function RecentOrders() {
  const { data, isLoading, isError } = useOrdersList(1);

  const orders = data?.data?.orders || [];
  const recentOrders = orders.slice(0, 3);

  const getStatusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
      case "shipped":
        return "text-green-600 bg-green-100";
      case "processing":
        return "text-blue-600 bg-blue-100";
      case "delivered":
        return "text-gray-700 bg-gray-100";
      case "created":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateObj: { $date: string } | string) => {
    try {
      const dateString = typeof dateObj === "string" ? dateObj : dateObj.$date;
      return new Date(dateString).toDateString();
    } catch {
      return "N/A";
    }
  };

  const calculateTotalAmount = (vendorOrders: any[]) => {
    return vendorOrders.reduce((sum, order) => sum + (order.amount || 0), 0);
  };

  const calculateTotalItems = (vendorOrders: any[]) => {
    return vendorOrders.reduce((sum, order) => sum + (order.quantity || 0), 0);
  };

  // Skeleton Loader
  if (isLoading) {
    return (
      <div className="w-full md:w-[300px] bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-black font-semibold text-base mb-3">Recent Orders</h2>

        <div className="flex flex-col gap-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="border-b border-gray-100 pb-3 animate-pulse"
            >
              <div className="h-3 w-32 bg-gray-200 rounded mb-2"></div>
              <div className="h-2 w-20 bg-gray-200 rounded mb-1"></div>
              <div className="h-2 w-24 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>

        <div className="w-full h-8 bg-gray-200 rounded-md mt-4 animate-pulse"></div>
      </div>
    );
  }

  // Error State
  if (isError) {
    return (
      <div className="w-full md:w-[300px] bg-white border border-gray-200 rounded-md p-4">
        <h2 className="text-black font-semibold text-base mb-3">Recent Orders</h2>
        <p className="text-red-500 text-sm text-center py-6">
          Failed to load orders.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full md:w-[300px] bg-white border border-gray-200 rounded-md p-4">
      <h2 className="text-black font-semibold text-base mb-3">Recent Orders</h2>

      {/* No Orders Fallback */}
      {recentOrders.length === 0 && (
        <p className="text-gray-500 text-sm text-center py-6">
          No recent orders.
        </p>
      )}

      <div className="flex flex-col gap-3">
        {recentOrders.map((order) => {
          const totalAmount = calculateTotalAmount(order.vendor_orders);
          const totalItems = calculateTotalItems(order.vendor_orders);

          return (
            <div
              key={order._id}
              className="flex items-center justify-between border-b border-gray-100 pb-2 last:border-b-0"
            >
              <div>
                <p className="text-sm font-semibold text-black">
                  {order.order_info.transaction_reference}
                </p>
                <p className="text-xs text-gray-500">
                  {formatDate(order.order_info.transaction_date)}
                </p>
                <p className="text-xs text-gray-600">
                  ₦{totalAmount.toLocaleString()} • {totalItems} item
                  {totalItems > 1 ? "s" : ""}
                </p>
              </div>

              <span
                className={`text-[11px] font-medium px-2 py-1 rounded-full capitalize ${getStatusColor(
                  order.order_info.status
                )}`}
              >
                {order.order_info.status}
              </span>
            </div>
          );
        })}
      </div>

      <Link href="/orders">
        <button className="w-full mt-4 text-center bg-black text-white py-2 rounded-md text-sm font-medium hover:bg-gray-800 transition-colors">
          View All Orders
        </button>
      </Link>
    </div>
  );
}

export default RecentOrders;
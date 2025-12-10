import { useQuery, QueryKey } from "@tanstack/react-query";
import { getOrders, getOrderDetails } from "./vendor"; // adjust import path as needed

export interface TrackingStatus {
  status: string;
  date: {
    $date: string;
  };
}

export interface Address {
  _id: string;
  address: string;
  first_name: string;
  phone_number: string;
  last_name: string;
  latitude: number;
  longitude: number;
  country: string;
  city: string;
  state: string;
  county: string;
  postalcode: string;
  user: string;
}

export interface OrderInfo {
  _id: string;
  transaction_reference: string;
  transaction_date: {
    $date: string;
  };
  address: Address;
  status: string;
  tax: number;
  is_ten_percent: boolean;
  tracking: TrackingStatus[];
  user: string;
  delivery_fee: number;
  merchant_reference: string;
  update_date: string;
}

export interface ItemInfo {
  _id: string;
  vendor_id: string;
  name: string;
  images: string[];
  cost_price: number;
  description: string;
  look_after_me: string;
  countries: string[];
  quantity: number;
  categories: string[];
  sub_categories: string[];
  genders: string[];
  colors: string[];
  sizes: string[];
  fabrics: string[];
  discounted_price: number;
  sku: string;
  created_at: string;
  updated_at: string;
  status: string;
  is_active: boolean;
  hidden: boolean;
  rejection_reason: string;
}

export interface VendorOrder {
  _id: string;
  item: string;
  item_info: ItemInfo;
  vendor_id: string;
  user: string;
  amount: number;
  quantity: number;
  batch_id: string;
  unique_id: string;
  tracking: TrackingStatus[];
  delivery_number: string;
  created_at: {
    $date: string;
  };
  updated_at: {
    $date: string;
  };
}

export interface Order {
  _id: string;
  order_info: OrderInfo;
  vendor_orders: VendorOrder[];
}

export interface OrdersMeta {
  total_count: number;
  page_number: number;
  page_size: number;
}

export interface OrdersListResponse {
  success: boolean;
  message: string;
  data: {
    orders: Order[];
    meta: OrdersMeta;
  };
}

export interface OrderDetailsResponse {
  success: boolean;
  message: string;
  data: Order;
}

// --- NEW INTERFACES FOR SINGLE ORDER DETAIL RESPONSE ---

export interface UserInfo {
    _id: string;
    first_name: string;
    last_name: string;
    email: string;
    dateofbirth: string;
    country_id: string;
    user_type: string;
    created_at: string;
    referral_code: string;
    is_ten_percent: boolean;
    phone_number: string;
    profilepicture: string;
    coverImage: string;
    is_active: boolean;
}

export interface ParticularOrderDetail {
    _id: string;
    item: ItemInfo; // Using the existing ItemInfo interface
    vendor_id: string;
    order_id: string;
    user: UserInfo; // New nested UserInfo
    amount: number;
    quantity: number;
    batch_id: string;
    unique_id: string;
    tracking: TrackingStatus[]; // Using the existing TrackingStatus interface
    created_at: { $date: string };
    updated_at: { $date: string };
    delivery_number: string;
    status: string;
    order_info: OrderInfo; // Using the existing OrderInfo interface
}

// The overall response object for fetching a single order details
export interface ParticularOrderDetailsResponse {
    success: boolean;
    message: string;
    data: ParticularOrderDetail[]; // Key change: 'data' is an array of ParticularOrderDetail
}


export const useOrdersList = (pageNumber: number = 1) => {
  return useQuery<OrdersListResponse>({
    queryKey: ["orders", pageNumber] as QueryKey,
    queryFn: getOrders,
    staleTime: 5 * 60 * 1000, // cache is fresh for 5 minutes
  });
};

export const useOrderDetails = (orderId: string, enabled: boolean = true) => {
  return useQuery<ParticularOrderDetailsResponse>({
    queryKey: ["order", orderId] as QueryKey,
    queryFn: () => getOrderDetails(orderId),
    enabled: !!orderId && enabled, // only fetch if orderId exists and enabled is true
    staleTime: 5 * 60 * 1000, // cache is fresh for 5 minutes
  });
};
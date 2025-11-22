import { ColorResponse, SubCategoryResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const token = localStorage.getItem("token");

const fetchColors = async () => {
  const response = await axios.get<ColorResponse>(`${backendUrl}/color/`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data.data;
};

export const useFetchColors = () => {
  return useQuery({
    queryKey: ["colors"],
    queryFn: () => fetchColors(),
    enabled: !!token,
  });
};

import { SubCategoryResponse } from "@/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

const token = localStorage.getItem("token");

const fetchGenders = async () => {
  const response = await axios.get<SubCategoryResponse>(
    `${backendUrl}/gender/`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
  return response.data.data;
};

export const useFetchGenders = () => {
  return useQuery({
    queryKey: ["genders"],
    queryFn: () => fetchGenders(),
    enabled: !!token,
  });
};

import axiosInstance from "@/config/api/axios";
import { ApiRoutes } from "@/config/api/routes";
import type { AdminStats } from "../interfaces/admin.interface";

export const getAdminStats = async (): Promise<AdminStats> => {
    try {
        const response = await axiosInstance.get(ApiRoutes.admin.stats);
        return response.data;
    } catch (error) {
        console.error("Error fetching admin stats:", error);
        throw error;
    }
}
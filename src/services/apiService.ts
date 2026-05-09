import axios, { AxiosInstance } from "axios";

const baseUrl = "https://loved-talent-fb87ca2a9f.strapiapp.com/api";

const api: AxiosInstance = axios.create({
    baseURL: baseUrl,
    headers: {
        "Content-Type": "application/json",
    },
});

api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("teja-token");
        if (token) {
            config.headers.authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response && error.response.status === 401) {
            localStorage.removeItem("teja-token");
            localStorage.removeItem("teja-details");

            window.location.href = "/";
        }
        return Promise.reject(error);
    }
);

export const apiService = {
    login: async (credentials: Record<string, string>) => {
        try {
            const response = await axios.post("/auth/local", credentials);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || error?.response?.data?.message?.[0] || 'Login failed';
        }
    },
    register: async (userData: Record<string, string>) => {
        try {
            const response = await axios.post("/auth/local/register", userData);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || error?.response?.data?.message?.[0] || 'Registration failed';
        }
    },
    forgotPassword: async (data: Record<string, string>) => {
        try {
            const response = await axios.post("/auth/forgot-password", data);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || error?.response?.data?.message?.[0] || 'Forgot password failed';
        }
    },
    resetPassword: async (data: Record<string, string>) => {
        try {
            const response = await axios.post("/auth/reset-password", data);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || error?.response?.data?.message?.[0] || 'Reset password failed';
        }
    },
    getPrivacyPolicy: async () => {
        try {
            const response = await api.get("/privacy-policy");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to load Privacy Policy';
        }
    },
    getAboutUs: async () => {
        try {
            const response = await api.get("/about-page");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to load About Us';
        }
    },
    getTermsAndConditions: async () => {
        try {
            const response = await api.get("/terms-and-condition");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to load Terms and Conditions';
        }
    },
    getProfileReviews: async () => {
        try {
            const response = await api.get("/users/me?populate[reviews_as_reviewed_user][populate]=*&populate[reviews_as_reviewer][populate]=*");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to load Profile Reviews';
        }
    },
    getProfileDetails: async () => {
        try {
            const response = await api.get("/users/me?populate=*");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to load Profile Details';
        }
    },
    updateProfile: async (id: number | string, data: Record<string, unknown>) => {
        try {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to update Profile';
        }
    },
    uploadProfileImage: async (formData: FormData) => {
        try {
            const response = await api.post("/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to upload image';
        }
    },
    changePassword: async (data: Record<string, string>) => {
        try {
            const response = await api.post("/auth/change-password", data);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to change password';
        }
    },
    addSkill: async (data: Record<string, unknown>) => {
        try {
            const response = await api.post("/skills", data);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to add skill';
        }
    },
    getMySkills: async (userId: number | string) => {
        try {
            const response = await api.get(`/skills?filters[user][id][$eq]=${userId}&populate=*`);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to get my skills';
        }
    },
    deleteSkill: async (documentId: string) => {
        try {
            const response = await api.delete(`/skills/${documentId}`);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to delete skill';
        }
    },
    getAllSkills: async () => {
        try {
            const response = await api.get("/skills?populate=*");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to get all skills';
        }
    },
    updateSkillApproval: async (documentId: string, approvalStatus: string) => {
        try {
            const response = await api.put(`/skills/${documentId}`, {
                data: {
                    approval_status: approvalStatus
                }
            });
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to update skill approval';
        }
    },
    getCategories: async () => {
        try {
            const response = await api.get("/categories?populate=*");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to get categories';
        }
    },
    addCategory: async (data: Record<string, unknown>) => {
        try {
            const response = await api.post("/categories", data);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to add category';
        }
    },
    deleteCategory: async (documentId: string) => {
        try {
            const response = await api.delete(`/categories/${documentId}`);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to delete category';
        }
    },
    // --- Users API ---
    getUsers: async () => {
        try {
            const response = await api.get("/users?populate=*");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to get users';
        }
    },
    deleteUser: async (id: number | string) => {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to delete user';
        }
    },
    updateUserBlockStatus: async (id: number | string, blocked: boolean) => {
        try {
            const response = await api.put(`/users/${id}`, { blocked });
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to update user block status';
        }
    },
    // --- Reports API ---
    getReports: async () => {
        try {
            const response = await api.get("/reports?populate=*");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to get reports';
        }
    },
    updateReport: async (id: number | string, data: Record<string, unknown>) => {
        try {
            const response = await api.put(`/reports/${id}`, { data });
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to update report';
        }
    },
    // --- Bookings API ---
    createBooking: async (data: Record<string, unknown>) => {
        try {
            const response = await api.post("/bookings", { data });
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to create booking';
        }
    },
    // --- Bookings API ---
    getBookings: async () => {
        try {
            const response = await api.get("/bookings?populate=*");
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to get bookings';
        }
    },
    updateBooking: async (id: number | string, data: Record<string, unknown>) => {
        try {
            const response = await api.put(`/bookings/${id}`, { data });
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to update booking';
        }
    },
    // --- Reports API ---
    createReport: async (data: Record<string, unknown>) => {
        try {
            const response = await api.post("/reports", { data });
            return response.data;
        } catch (error: any) {
            throw error?.response?.data?.error?.message || 'Failed to create report';
        }
    },
    // --- Dashboard API ---
    getUserDashboard: async () => {
        try {
            const response = await api.get("/user-dashboard");
            return response.data;
        } catch (error: any) {
            console.error("apiService.getUserDashboard error:", error);
            const msg = error?.response?.data?.error?.message || error?.response?.data?.message || error?.message || 'Failed to get dashboard data';
            throw msg;
        }
    }
};

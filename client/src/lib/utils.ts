import axios from "axios";
import { toast } from "sonner";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

export const showSuccessToast = (message: string) => {
  toast.success(message);
};

export const showErrorToast = (error: any) => {
  toast.error(
    typeof error === "string"
      ? error
      : error.response.data.message || error.response.data || error.message
  );
};

export const showLoadingToast = (message: string) => {
  toast.loading(message);
};

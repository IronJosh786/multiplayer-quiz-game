import { axiosInstance } from "./utils";

type AuthDataType = {
  username: string;
  password: string;
  authType: string;
};

export const authenticate = async ({
  username,
  password,
  authType,
}: AuthDataType) => {
  try {
    const data = {
      username: username?.trim(),
      password: password?.trim(),
    };
    const url = `/auth/${authType === "signin" ? "sign-in" : "sign-up"}`;
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

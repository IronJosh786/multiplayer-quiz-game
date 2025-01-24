import { axiosInstance } from "./utils";

type AuthDataType = {
  email: string;
  password: string;
  authType: string;
};

export const authenticate = async ({
  email,
  password,
  authType,
}: AuthDataType) => {
  try {
    const data = {
      email: email?.trim(),
      password: password?.trim(),
    };
    const url = `/auth/${authType === "signin" ? "sign-in" : "sign-up"}`;
    const response = await axiosInstance.post(url, data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const fetchQuotes = async () => {
  try {
    const response = await axiosInstance.get("/quotes/get-quotes");
    return response.data.data;
  } catch (error) {
    throw error;
  }
};

export const postQuote = async (text: string) => {
  try {
    const data = {
      text: text?.trim(),
    };
    const response = await axiosInstance.post("/quotes/new-quote", data);
    return response.data;
  } catch (error) {
    throw error;
  }
};

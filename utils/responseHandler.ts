import axios, { AxiosRequestConfig } from "axios";

// Generic function to handle API requests
export const handleApiRequest = (config: AxiosRequestConfig<any>) => {
  return axios(config)
    .then((response) => {
      return {
        data: response.data.data,
        success: response.data.success,
        message: response.data.message,
      };
    })
    .catch((error) => {
      return {
        data: null,
        success: false,
        message: !error.response ? error.message : error.response.data.message,
        errors: error?.response?.data?.errors,
      };
    });
};

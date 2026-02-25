import axiosInstance from "./axiosInstance";

const handleResponse = (response) => response.data;

const handleError = (error) => {
  const message =
    error?.response?.data?.error?.message ||
    error?.message ||
    "Something went wrong";

  return Promise.reject(message);
};

export const apiGet = (url, config = {}) =>
  axiosInstance.get(url, config).then(handleResponse).catch(handleError);

export const apiPost = (url, data, config = {}) =>{
  // console.log("Making POST request to:", url, "with data:", data);
  return axiosInstance.post(url, data, config).then(handleResponse).catch(handleError);
}

export const apiPut = (url, data, config = {}) =>
  axiosInstance.put(url, data, config).then(handleResponse).catch(handleError);

export const apiDelete = (url, config = {}) =>
  axiosInstance.delete(url, config).then(handleResponse).catch(handleError);
import { LogLevelString } from "@firebase/logger"
import { API_URL } from "../../config";

const accessToken = localStorage.getItem("accessToken");
let selectedCustomerData: any = localStorage.getItem("selectedCustomerData");
if (selectedCustomerData) selectedCustomerData = JSON.parse(selectedCustomerData);

const fetchData = async (method: string, endpoint: string, errorMessage: string, body?: any) => {
  const headers: any = {
    "Content-Type": "application/json",
  };

  if (accessToken) {
    headers["Authorization"] = `${accessToken}`;
  }

  try {
    const requestOptions: any = {
      method: method,
      headers: headers,
    };

    if (body && selectedCustomerData) {
      requestOptions.body = JSON.stringify({
        ...body,
        project_id: selectedCustomerData.id
      });
    } else if (body) {
      requestOptions.body = JSON.stringify({
        ...body
      });
    }

    const response = await fetch(API_URL + endpoint, requestOptions);

    const data = await response.json();

    if (!response.ok) {
      if (data instanceof Error || (data.message)) {
        throw data;
      } else {
        throw new Error(`Falha ao buscar ${errorMessage}`);
      }
    }

    return { success: true, data: data }
  } catch (error) {
    return { success: false, error: error }
  }
};

function isLogLevelString(level: any): level is LogLevelString {
  return ['debug', 'verbose', 'info', 'warn', 'error', 'silent'].includes(level);
}

export {
  fetchData,
  isLogLevelString
}
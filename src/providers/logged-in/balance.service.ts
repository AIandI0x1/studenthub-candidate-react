import axios from "../AxiosService";

/**
 * load payable data
 * @param page
 */
export async function payableList(page: number): Promise<any> {
  const url = `/balance/payable-list?page=${page}`;
  const response = await axios.get(url);
  return response;
} 
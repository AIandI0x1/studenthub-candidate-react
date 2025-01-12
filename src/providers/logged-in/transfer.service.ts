import axios from "../AxiosService";
/* 
   * List of all transfers
   * @returns {Observable<any>}
   */
export async function listTransfers(): Promise<any> {
  const url = '/account/salary';
  const response = await axios.get(url);
  return response.data;
} 
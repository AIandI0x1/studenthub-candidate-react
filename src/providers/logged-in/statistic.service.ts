import axios from "../AxiosService";
const _statisticsEndpoint = '/statistics';

/**
 * Return statistics
   * @returns {Promise<any>}
 */
export async function get(): Promise<any> {
  const url = _statisticsEndpoint + '?expand=store,company';
  const response = await axios.get(url);
  return response.data;
} 
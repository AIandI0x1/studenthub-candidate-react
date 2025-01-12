import axios from "../AxiosService";

const _noticationEndpoint = '/candidate-notifications';

/**
 * List 
 * @returns {Observable<any>}
 */
export async function listNotifications(page: number, urlParams: string = ''): Promise<any> {
  const url = _noticationEndpoint + '?page=' + page + urlParams;
  const response = await axios.get(url);
  return response;
}

export async function markNotificationRead(id: string): Promise<any> {
  const url = _noticationEndpoint + '/mark-read/' + id;
  const response = await axios.patch(url, {});
  return response.data;
}

export async function markReadAllNotifications(): Promise<any> {
  const url = _noticationEndpoint + '/mark-read-all';
  const response = await axios.patch(url, {});
  return response.data;
} 
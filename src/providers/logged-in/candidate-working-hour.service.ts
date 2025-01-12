import { CandidateWorkingHour } from "@/models/candidate";
import axios from "../AxiosService";


const _workingHourEndpoint = '/candidate-working-hours';

/**
   * Return working dates
   * @returns {Observable<any>}
   */
export async function listWorkingDates(page: number, params = '&expand=store,store.company'): Promise<any> {
  const url = _workingHourEndpoint + `/working-dates?page=${page}&expand=${params}`;
  //const url = _workingHourEndpoint + '/date?page=' + page + params;
  const response = await axios.get(url);
  return response;
}

/**
 * add session manually 
 * @param model 
 * @returns 
 */
export async function addWorkingHour(model: CandidateWorkingHour): Promise<any> {
  const url = _workingHourEndpoint;
  const response = await axios.post(url, model);
  return response.data;
}

/**
 * return detail
 * @param date
 */
export async function workingDateDetail(date: string): Promise<any> {
  const url = `${_workingHourEndpoint}/date-detail/${date}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Return working date stats
 * @param date 
 * @returns 
 */
export async function workingDateStats(date: string): Promise<any> {
  const url = `${_workingHourEndpoint}/stats?${date}`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * Return working hours
 * @returns {Observable<any>}
 */
export async function listHours(page: number, param: string = ""): Promise<any> {
  const url = _workingHourEndpoint + `/hour?page=${page}&expand=candidateWorkingHourAppeal,candidateWorkLogFeedback,candidateWorkLogFeedback.store,store,store.company${param}`;
  const response = await axios.get(url);
  return response;
}

/**
 * @param id 
 * @returns 
 */
export async function getWorkingHourAppeal(id: string): Promise<any> {
  const url = _workingHourEndpoint + `/appeal/${id}?expand=correctedHours,originalHour,candidateWorkingDate,candidateWorkingHourAppealUpdates,candidateWorkingHourAppealUpdates.createdBy`;
  const response = await axios.get(url);
  return response.data;
}

/**
 * @param id 
 * @param reason 
 * @returns 
 */
export async function postWorkingHourAppeal(id: string, reason: string): Promise<any> {
  const url = _workingHourEndpoint + `/appeal/${id}`;
  const response = await axios.post(url, {
    reason: reason
  });
  return response.data;
}

export async function markAppealUpdateRead(appeal_update_uuid: string): Promise<any> {
  const url = _workingHourEndpoint + `/mark-read-appeal-update/${appeal_update_uuid}`;
  const response = await axios.patch(url, {
  });
  return response.data;
}
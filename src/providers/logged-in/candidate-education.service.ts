import { CandidateEducation } from "@/models/candidate-education";
import axios from "../AxiosService";

const _educationEndpoint = '/candidate-educations';

/**
 * List all requests with page
 * @returns {Observable<any>}
 */
export async function listEducations(page: number, urlParams: string = ''): Promise<any> {
  const url = _educationEndpoint + '?page=' + page + urlParams;
  const response = await axios.get(url);
  return response;
}

/**
 * @param page 
 * @param urlParams 
 * @returns 
 */
export async function listMajors(page: number = -1, urlParams: string = ''): Promise<any> {
  const url = _educationEndpoint + '/majors?page=' + page + urlParams;
  const response = await axios.get(url);
  return response;
}

/**
 * @param page 
 * @param urlParams 
 * @returns 
 */
export async function listDegrees(page: number = -1, urlParams: string = ''): Promise<any> {
  const url = _educationEndpoint + '/degrees?page=' + page + urlParams;
  const response = await axios.get(url);
  return response;
}

/**
 * @param page 
 * @param urlParams 
 * @returns 
 */
export async function listDegreeGroups(page: number = -1, urlParams: string = ''): Promise<any> {
  const url = _educationEndpoint + '/degree-groups?page=' + page + urlParams;
  const response = await axios.get(url);
  return response;
}

/**
 * return education detail
 * @param education_uuid
 */
export async function educationDetail(education_uuid: string): Promise<any> {
  const url = _educationEndpoint + '/' + education_uuid + '?expand=university,major,degree';
  const response = await axios.get(url);
  return response.data;
}

/**
 * save education details
 * @param candidateEducations 
 * @returns 
 */
export async function saveEducation(candidateEducations: any[]): Promise<any> {
  const url = _educationEndpoint + '/save';
  const response = await axios.post(url, {
    candidateEducations: candidateEducations
  });
  return response.data;
}

/**
 * add education
 * @param model 
 * @returns 
 */
export async function createEducation(model: CandidateEducation): Promise<any> {
  const url = _educationEndpoint;
  const response = await axios.post(url, model);
  return response.data;
}

/**
 * @param model 
 * @returns 
 */
export async function updateEducation(model: CandidateEducation): Promise<any> {
  const url = _educationEndpoint + '/' + model.education_uuid;
  const response = await axios.patch(url, model);
  return response.data;
}

/**
 * @param education_uuid 
 * @returns 
 */
export async function deleteEducation(education_uuid: string): Promise<any> {
  const url = _educationEndpoint + '/' + education_uuid;
  const response = await axios.delete(url);
  return response.data;
} 
import axios from "../AxiosService";
import { CandidateLink } from "@/models/candidate-link";

const _candidateLinkEndpoint = '/candidate-links';

/**
 * List all requests with page
 * @returns {Observable<any>}
 */
export async function listCandidateLinks(page: number, urlParams: string = ''): Promise<any> {
  const url = _candidateLinkEndpoint + '?page=' + page + urlParams;
  const response = await axios.get(url);
  return response;
}

/**
 * return experience detail
 * @param candidate_experience_id
 */
export async function candidateLinkDetail(cl_uuid: string): Promise<any> {
  const url = _candidateLinkEndpoint + '/' + cl_uuid;
  const response = await axios.get(url);
  return response.data;
}

/**
 * add experience
 * @param model 
 * @returns 
 */
export async function createCandidateLink(model: CandidateLink): Promise<any> {
  const url = _candidateLinkEndpoint;  
  const response = await axios.post(url, model);
  return response.data;
}

/**
 * @param model 
 * @returns 
 */
export async function updateCandidateLink(model: CandidateLink): Promise<any> {
    const url = _candidateLinkEndpoint + '/' + model.cl_uuid;
  const response = await axios.patch(url, model);
  return response.data;
}

/**
 * @param candidate_experience_id 
 * @returns 
 */
export async function deleteCandidateLink(cl_uuid: string): Promise<any> {
  const url = _candidateLinkEndpoint + '/' + cl_uuid;
  const response = await axios.delete(url);
  return response.data;
} 
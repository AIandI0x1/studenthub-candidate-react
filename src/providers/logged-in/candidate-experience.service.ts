import { CandidateExperience } from "@/models/candidate.experience";
import axios from "../AxiosService";

const _experienceEndpoint = '/candidate-experiences';

/**
 * List all requests with page
 * @returns {Observable<any>}
 */
export async function listExperiences(page: number, urlParams: string = ''): Promise<any> {
  const url = _experienceEndpoint + '?page=' + page + urlParams;
  const response = await axios.get(url);
  return response;
}

/**
 * return experience detail
 * @param candidate_experience_id
 */
export async function experienceDetail(candidate_experience_id: string): Promise<any> {
  const url = _experienceEndpoint + '/' + candidate_experience_id + '?expand=university,major,degree';
  const response = await axios.get(url);
  return response.data;
}

/**
 * save experience details
 * @param candidateExperiences 
 * @returns 
 */
export async function saveExperience(candidateExperiences: any[]): Promise<any> {
  const url = _experienceEndpoint + '/save';
  const response = await axios.post(url, {
    candidateExperiences: candidateExperiences
  });
  return response.data;
}

/**
 * add experience
 * @param model 
 * @returns 
 */
export async function createExperience(model: CandidateExperience): Promise<any> {
  const url = _experienceEndpoint;
  const response = await axios.post(url, model);
  return response.data;
}

/**
 * @param model 
 * @returns 
 */
export async function updateExperience(model: CandidateExperience): Promise<any> {
  const url = _experienceEndpoint + '/' + model.candidate_experience_id;
  const response = await axios.patch(url, model);
  return response.data;
}

/**
 * @param candidate_experience_id 
 * @returns 
 */
export async function deleteExperience(candidate_experience_id: string): Promise<any> {
  const url = _experienceEndpoint + '/' + candidate_experience_id;
  const response = await axios.delete(url);
  return response.data;
} 
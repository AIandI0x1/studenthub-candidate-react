import { JobInterest } from "@/models/job-interest";
import axios from "../AxiosService";

 
const _jobEndpoint = '/jobs';
 
export async function showInterest(jobInterest: JobInterest): Promise<any> {
    let url = _jobEndpoint + '/apply/' + jobInterest.job_uuid;
    const response = await axios.post(url, jobInterest);
    return response.data;
}

/**
 * return Jobs 
 */
export async function listJobs(page: number = 1, searchParams: string = ''): Promise<any> {
    let url = _jobEndpoint + '?&page=' + page + searchParams + '&expand=area,jobSkills,createdBy,jobInterest';
    const response = await axios.get(url);
    return response;
}

/**
 * Return job detail
 * @param job_uuid
 */
export async function viewJob(job_uuid: string): Promise<any> {
    const url = _jobEndpoint + '/' + job_uuid + '?expand=area,jobSkills,jobInterest';
    const response = await axios.get(url);
    return response.data;
}



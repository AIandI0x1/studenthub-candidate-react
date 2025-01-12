import axios from "../AxiosService";
const _requestEndpoint = '/requests';
 
/**
   * List all requests with page
   * @returns {Observable<any>}
   */
export async function listRequests(page: number, urlParams: string = ''): Promise<any> {
    const url = _requestEndpoint + '?page=' + page + urlParams;
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * list job applications 
   * @param page 
   * @param urlParams 
   * @returns 
   */
  export async function listApplications(page: number, urlParams: string = ''): Promise<any> {
    const url = _requestEndpoint + '/applications?page=' + page + urlParams;
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * list interview requests 
   * @param page 
   * @returns 
   */
  export async function listInterviewRequests(page: number, urlParams: string = ""): Promise<any> {
    let url = _requestEndpoint + '/interview-requests?expand=request&page=' + page + urlParams;
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * apply for job/ request
   * @param request_uuid 
   * @returns 
   */
  export async function applyRequest(request_uuid: string): Promise<any> {
    const url = _requestEndpoint + '/apply/' + request_uuid;
    const response = await axios.post(url, {});
    return response.data;
  }
  
  /**
   * view request
   * @param request_uuid 
   * @returns 
   */
  export async function viewRequest(request_uuid: string): Promise<any> {
    const url = _requestEndpoint + '/' + request_uuid + '?expand=requestSkills';
    const response = await axios.get(url);
    return response.data;
  }

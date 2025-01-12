import axios from "../AxiosService";
const _invitationEndpoint = '/invitations';


/**
 * Return invitations
 * @returns {Observable<any>}
 */
export async function listInvitations(page: number): Promise<any> {
  const url = _invitationEndpoint + '?page=' + page + '&expand=request,request.requestSkills,company,note,reply,suggestion';
  const response = await axios.get(url);
  return response.data;
}

/**
 * Return invitations
 * @returns {Observable<any>}
 */
export async function countInvitations(): Promise<any> {
  const url = _invitationEndpoint + '?count=1';
  const response = await axios.get(url);
  return response.data;
}

/**
 * return invitation detail
 * @param invitation_uuid
 */
export async function detailInvitation(invitation_uuid: string): Promise<any> {
  const url = _invitationEndpoint + '/' + invitation_uuid + '?expand=request,request.requestSkills,request.location,company,note,reply';
  const response = await axios.get(url);
  return response.data;
}

/**
 * mark all invitaions as viewed
 * @returns 
 */
export async function markAsViewed(): Promise<any> {
  const url = _invitationEndpoint + '/log-viewed';
  const response = await axios.get(url);
  return response.data;
}

/**
 * accept invitation for request
 * @param invitation_uuid
 * @param reason
 */
export async function accept(invitation_uuid: string, reason: string = ''): Promise<any> {
  const url = _invitationEndpoint + '/accept/' + invitation_uuid;
  const params = {
    reason: reason
  };
  const response = await axios.patch(url, params);
  return response.data;
}

/**
 * reject invitation for request
 * @param invitation_uuid
 * @param reason
 */
export async function reject(invitation_uuid: string, reason: string = ''): Promise<any> {
  const url = _invitationEndpoint + '/reject/' + invitation_uuid;
  const params = {
    reason: reason
  };
  const response = await axios.patch(url, params);
  return response.data;

}

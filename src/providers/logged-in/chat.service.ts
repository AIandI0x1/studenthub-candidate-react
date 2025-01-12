import axios from "../AxiosService";

 
const _chatEndpoint = '/chats';
 
/**
 * return work history
 * @param candidate
 */
export async function listChats(page: number = 1, filters: any): Promise<any> {
  let url = _chatEndpoint + '?page=' + page + '&expand=staff,contact,company,store,candidateUnreadCount,recentMessage';

  if (filters.company_id) {
    url += "&company_id=" + filters.company_id;
  }
  
  if (filters.store_id) {
    url += "&store_id=" + filters.store_id;
  }

  if (filters.staff_id) {
    url += "&staff_id=" + filters.staff_id;
  }

  const response = await axios.get(url);
  return response;
}

export async function getMessages(chat_uuid: string, page: number = 1, last_index: number | null = null): Promise<any> {
  let url = _chatEndpoint + '/messages/' + chat_uuid + "?per-page=5&page=" + page;

  if (last_index) {
    url += "&last_index=" + last_index;
  }
  
  const response = await axios.get(url);
  return response;
}

export async function getNewMessages(chat_uuid: string, last_index: number | null = null): Promise<any> {
  let url = _chatEndpoint + '/new-messages/' + chat_uuid;

  if (last_index) {
    url += "?last_index=" + last_index;
  }
  
  const response = await axios.get(url);
  return response.data;
}

export async function unreadCount(): Promise<any> {
  let url = _chatEndpoint + '/unread-count'
  const response = await axios.get(url);
  return response.data;
}

export async function viewChat(chat_uuid: string): Promise<any> {
  let url = _chatEndpoint + '/' + chat_uuid + "?expand=staff,contact,company,store"
  const response = await axios.get(url);
  return response.data;
}

/**
 * start chat with current employer
 * @returns 
 */
export async function startChat(): Promise<any> {
  let url = _chatEndpoint + '/start-chat'
  const response = await axios.post(url, {});
  return response.data;
}

export async function postChatMessage(chat_uuid: string, message: string): Promise<any> {
  let url = _chatEndpoint + '/send-message'
  const response = await axios.post(url, {
    chat_uuid,
    message
  });
  return response.data;
}

export async function markRead(chat_uuid: string): Promise<any> {
  let url = _chatEndpoint + '/mark-read/' + chat_uuid;
  const response = await axios.patch(url, {});
  return response.data;
}

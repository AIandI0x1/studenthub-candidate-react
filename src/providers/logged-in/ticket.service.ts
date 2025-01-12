import { Ticket } from "@/models/ticket";
import { TicketComment } from "@/models/ticket_comment";
import axios from "../AxiosService";

const _ticketEndpoint = '/tickets';

  /**
   * return ticket lists
   * @param page
   * @returns
   */
  export async function listTickets(page: number = 1): Promise<any> {
    const url = _ticketEndpoint + '?expand=agent,staff&page=' + page;
    const response = await axios.get(url);
    return response;
  }

  /**
   * list comments
   * @param ticket_uuid
   * @returns
   */
  export async function listComments(ticket_uuid: string): Promise<any> {
    const url = _ticketEndpoint + '/comments/' + ticket_uuid + '?expand=ticketCommentAttachments.attachment,agent,staff';
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * return ticket detail
   * @param ticket_uuid
   * @returns
   */
  export async function viewTicket(ticket_uuid: string): Promise<any> {
    const url = _ticketEndpoint + '/' + ticket_uuid + '?expand=ticketAttachments.attachment,agent,staff,ticketComments,ticketComments.agent,ticketComments.staff,ticketComments.ticketCommentAttachments.attachment';
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * generate tickets
   * @param ticket
   * @param attachments
   * @returns
   */
  export async function createTicket(ticket: Ticket, attachments = []): Promise<any> {
    const url = _ticketEndpoint;
    const response = await axios.post(url, {
      'detail':  ticket.ticket_detail,
      attachments: attachments
    });
    return response.data;
  }

  /**
   * comment on ticket
   * @param model
   * @param attachments
   * @returns
   */
  export async function comment(model: TicketComment, attachments = []): Promise<any> {
    const url = _ticketEndpoint + '/comment/' + model.ticket_uuid;
    const response = await axios.patch(url, {
      comment_detail:  model.ticket_comment_detail,
      attachments: attachments
    });
    return response.data;
  }

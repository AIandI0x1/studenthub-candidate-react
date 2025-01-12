import axios, { pdfget } from "../AxiosService";

 
const _candidateEndpoint = '/candidates';
 
  /**
   * return work history
   * @param candidate
   */
  export async function listWorkHistory(): Promise<any> {
    const url = _candidateEndpoint + '/work-history?expand=store,company,company.parentCompany';
    const response = await axios.get(url);
    return response.data;
  }

/**
 * assignment details
   * @param id 
   * @returns 
   */
  export async function workHistoryDetail(id: string | number): Promise<any> {
    const url = _candidateEndpoint + '/work-history/' + id + '?expand=store,company,company.parentCompany,contract,contract.amount';
    const response = await axios.get(url);
    return response.data;
  }

  /**
   * download candidate appreciation certificate
   * @param workHistoryID
   */
  export async function downloadCertificate(workHistoryID: number | string): Promise<any> {
    let url = `${_candidateEndpoint}/appreciation-certificate/${workHistoryID}`;
    await pdfget(url, 'appreciation-certification-' + workHistoryID + '.pdf');
  } 
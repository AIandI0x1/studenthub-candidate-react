import axios from "../AxiosService";

const _discountEndpoint = "/discounts";
 
  /**
   * List of all discount
   * @returns {Observable<any>}
   */
  export async function listDiscounts(page: number, urlParams: string = ""): Promise<any> {
    let url = _discountEndpoint + '?expand=company,store,category&page=' + page + urlParams;
    const response = await axios.get(url);
    return response;
  }
  
  /**
   * return discount detail 
   * @param discount_uuid 
   */
  export async function viewDiscount(discount_uuid: string): Promise<any> {
    let url = _discountEndpoint + '/' + discount_uuid + '?expand=company,store,category';
    const response = await axios.get(url);
    return response.data;
  } 
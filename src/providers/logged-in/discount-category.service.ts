import axios from "../AxiosService";

const _discountEndpoint = "/discount-categories";

/**
 * List of all discount
 * @returns {Observable<any>}
 */
export async function listDiscountCategories(page: number): Promise<any> {
  let url = _discountEndpoint + '?expand=&page=' + page;
  const response = await axios.get(url);
  return response;
}

/**
 * return discount detail 
 * @param category_id 
 */
export async function viewDiscountCategory(category_id: number): Promise<any> {
  let url = _discountEndpoint + '/' + category_id + '?expand=';
  const response = await axios.get(url);
  return response.data;
}


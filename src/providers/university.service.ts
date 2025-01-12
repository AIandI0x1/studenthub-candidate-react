import axios from "@/providers/AxiosService";

  /**
   * Filter university
   */
  export async function  filterUniversities(keyword: string = '', page: number = -1): Promise<any> {
    const response = await axios.get(`/universities?q=${keyword}&page=${page}`);
    return response;
  }

  /**
   * Add new university if not available in list 
   */
  export async function createUniversity(name: string): Promise<any> {
    const response = await axios.post('/universities', { name });
    return response.data;
  } 
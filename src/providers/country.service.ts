import axios from "@/providers/AxiosService";

export async function filterCountries(keyword: string): Promise<any> {
    return await axios.get(`/countries?q=${keyword}`);
}



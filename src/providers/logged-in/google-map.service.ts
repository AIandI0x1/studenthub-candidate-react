import axios from "../AxiosService";
const _googleMapEndpoint = "/google-map/";

/**
 * Places list by keyword 
 * @returns {Observable<any>}
 */
export async function getPlacePredictions(query: string, country_name: string): Promise<any> {
    let url = _googleMapEndpoint + 'place-predictions?query=' + query + '&country_name=' + country_name;
    const response = await axios.get(url);
    return response.data;
}

/**
 * Return place detai 
 * @param place
 */
export async function placeDetail(place: any): Promise<any> {
    let country_name = place.terms[place.terms.length - 1].value;
    let url = _googleMapEndpoint + 'place-detail/' + place.place_id + '?name=' + place.structured_formatting.main_text +
        '&country_name=' + country_name;
    const response = await axios.get(url);
    return response.data;
}         
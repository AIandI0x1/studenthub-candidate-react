import axios from "@/providers/AxiosService";

export async function clickCampaign(utm_uuid: string): Promise<any> {
    const response = await axios.patch(`/campaigns/click/${utm_uuid}`, {});
    return response.data;
}



import { useTimeAgo } from "@/utils/app";
import { useTranslation } from "react-i18next";

export function TimeAgo({ time }: { time: string }) {
    const { t } = useTranslation();
    
    let { timeAgo } = useTimeAgo(time, t);

    return <>{timeAgo}</>;
}
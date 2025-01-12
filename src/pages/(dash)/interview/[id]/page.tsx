import { Suspense } from "react";
import Loading from "../loading";

export default function InterviewDetailPage() {
    return (
        <Suspense fallback={<Loading />}>   
        <div>
             Page
        </div>
        </Suspense>
    );
}
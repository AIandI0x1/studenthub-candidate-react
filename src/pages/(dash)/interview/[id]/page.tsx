import { Suspense } from "react";
import Loading from "../loading";
import DashLayout from "../../layout";

export default function InterviewDetailPage() {
    return (
        <Suspense fallback={<Loading />}>   
        <DashLayout>
        <div>
             Page
        </div>
        </DashLayout>
        </Suspense>
    );
}
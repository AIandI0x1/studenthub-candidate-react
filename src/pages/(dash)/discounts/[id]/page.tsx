import { Suspense } from "react";
import Loading from "../loading";
import DashLayout from "../../layout";

export default function DiscountViewPage() {
    return (
        <Suspense fallback={<Loading />}>
            <DashLayout>
            <div>
                Discounts Page
            </div>
            </DashLayout>
        </Suspense>
    );
}
import { Suspense } from "react";
import Loading from "../loading";

export default function DiscountViewPage() {
    return (
        <Suspense fallback={<Loading />}>
        <div>
            Discounts Page
        </div>
        </Suspense>
    );
}
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function LoadingChatList() {
    return (
        <>
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                        <Skeleton className="h-[32px] w-[60%] " />
                    </h5>

                </div>    
            </div>
            
            <div className="max-w-4xl mx-auto p-6"> 

                <Card className="w-full h-[107px]">
                    <CardHeader>
                        <CardTitle><Skeleton className="w-[40%] h-7" /></CardTitle>
                        <CardDescription><Skeleton className="w-[80%] h-7" /></CardDescription>
                    </CardHeader>
                </Card>        
            </div>    
        </>
    );
}


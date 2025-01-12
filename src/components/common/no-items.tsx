import { useTranslation } from "react-i18next";

export default function NoItems({ image, message, title = null }: { image: string, message: string, title: string | null }) {
    const { t } = useTranslation();

    return (
        <div className="inline-flex flex-col justify-center items-center w-full">
            { image && <img src={image} alt="No items" className="mt-auto" /> }
            <div className="flex flex-col items-center gap-2">
                { title && <h5 className=" text-[color:var(--Neutral-80,#68687A)] text-center text-base font-semibold leading-6">
                        {t(title)}
                    </h5>
                }
                { message && 
                    <p className=" text-[color:var(--Neutral-80,#68687A)] text-center text-sm font-normal leading-5">{t(message)}</p>
                }
            </div>
            
        </div>
    );
}
import { useTranslation } from "react-i18next";
import { Button } from "./button";
import { useEffect } from "react";


interface SubmitButtonProps {
    disabled?: boolean;
    float?: boolean;
    loading?: boolean;
    onClick?: () => void;
}
 

export default function SubmitButton({ disabled, float = true, loading = false, onClick }: SubmitButtonProps) {

    const { t } = useTranslation();

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Enter' && !disabled) {
                onClick?.();
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [disabled]);

    return (
        <>
        <div className={ `${float ? 'xs:float-auto sm:float-end':'text-center'} mt-8 
            font-semibold text-base items-center` }>
{/*
            <Button variant={"ghost"} className="text-[#4B4B61] text-center  text-base font-normal leading-6">
                Do it later
            </Button>    */}

            <Button size="lg" className="shadow-none xs:w-full sm:w-[156px] h-[56px] text-base font-semibold leading-6
                disabled:bg-[#EEEEF0] disabled:text-[color:#68687A]" disabled={ disabled } onClick={onClick}>
                {loading ? (
                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="sr-only">{t('Loading...')}</span>
                    </div>
                ) : (
                    t("Next")
                )}
            </Button>
            <p className={ `mt-[8px] xs:hidden ${disabled?'hideen':'sm:block'}  text-center` }>
                {t('Enter ↵')}    
            </p> 

        </div>
        
        <div className="clearfix"></div>
        </>
    );
}
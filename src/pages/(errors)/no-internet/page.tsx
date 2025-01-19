import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

export default function NoInternetErrorPage() {
  const router = useHistory();

  const { t } = useTranslation();

    useEffect(() => {
        if (navigator.onLine) {
            router.goBack();
        }
    }, [navigator.onLine]);

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">500</h1>
        <span className="font-medium">{t("Oops! Server error!")}</span>
        <p className="text-center text-muted-foreground">
          {t("Please check your internet connection.")}
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => router.goBack()}>
            {t('Go Back')}
          </Button>
          <Button asChild>
            <Link to="/">{t('Back to Home')}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { Link } from 'react-router-dom'
import { useHistory } from 'react-router-dom'
import { useTranslation } from 'react-i18next';

export default function NotFoundPage() {
  const router = useHistory();
  const { t} = useTranslation();

  return (
    <div className="h-svh">
      <div className="m-auto flex h-full w-full flex-col items-center justify-center gap-2">
        <h1 className="text-[7rem] font-bold leading-tight">404</h1>
        <span className="font-medium">{t("Oops! Page Not Found!")}</span>
        <p className="text-center text-muted-foreground">
          {t("It seems like the page you are looking for")} <br />
          {t('does not exist or might have been removed.')}
        </p>
        <div className="mt-6 flex gap-4">
          <Button variant="outline" onClick={() => router.goBack()}>
            {t("Go Back")}
          </Button>
          <Button asChild>
            <Link to="/">{t("Back to Home")}</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

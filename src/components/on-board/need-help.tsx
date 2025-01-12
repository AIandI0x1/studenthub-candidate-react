import { useTranslation } from "react-i18next";

export default function NeedHelp() {
  const { t} = useTranslation();
  
    return (
      <div className="mt-[32px] relative space-y-2 text-sm text-muted-foreground">
        <p>
          {t('Need help?')}{" "}
          <a href="/contact" className="no-underline text-primary">
            {t('Contact Us')}
          </a>
        </p>
      </div>
    );
}
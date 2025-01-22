import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
export default function NeedHelp() {
  const { t} = useTranslation();
  
    return (
      <div className="mt-[32px] relative space-y-2 text-sm text-muted-foreground">
        <p>
          {t('Need help?')}{" "}
          <Link to="/contact" className="no-underline text-primary">
            {t('Contact Us')}
          </Link>
        </p>
      </div>
    );
}
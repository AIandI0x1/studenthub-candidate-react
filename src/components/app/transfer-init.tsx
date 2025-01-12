import { dateTimeFormat } from '@/utils/common';
import React from 'react';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations

const CompensationTransferNotification = ({ candidateNotification, onClick }: { candidateNotification: any, onClick: any }) => {
  const { t } = useTranslation();
  const [isNew, setIsNew] = React.useState(candidateNotification.is_new);

  return (
    <div onClick={() => onClick() && setIsNew(false)} className={ `${isNew? 'cursor-pointer': ''} card p-4 flex flex-col gap-2 rounded-lg bg-white shadow-md relative` }>
      <h5 className="text-gray-900 font-semibold text-lg leading-7 m-0">
        {t("Compensation Transfer Initiated")}
      </h5>
      <p className="text-gray-600 text-sm leading-4 m-0">
        {t("Your compensation transfer has been initiated. It should be completed within 1-2 business days.")}
      </p>
      <p className="txt-time text-end text-gray-500 text-xs leading-4 m-0">
        {dateTimeFormat(candidateNotification.created_at, 'MMM d')}
        {/*new Date(candidateNotification.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })*/}
      </p>
      {isNew && (
        <span className="unread w-3.5 h-3.5 bg-blue-500 absolute top-3 end-4 rounded-full"></span>
      )}
    </div>
  );
};

export default CompensationTransferNotification;
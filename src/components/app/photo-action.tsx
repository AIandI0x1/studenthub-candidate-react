// components/App/PhotoAction.jsx

import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { Images, Trash2 } from 'lucide-react';

const PhotoAction = ({ fileInput, onClose }: { fileInput: any, onClose: any }) => {
    const { t } = useTranslation();

    const handleAction = (action: string) => {
        if (action === 'browse') {
            fileInput.current.click(); // Trigger the file input click
        }
        onClose(action); // Close the popover and pass the action
    };

    return (
        <div className="popover-content">
            <h3 className="text-lg font-semibold">{t("Select Action")}</h3>
            <ul className="list-none p-0">
                <li className="flex items-center p-2 cursor-pointer" onClick={() => handleAction('browse')}>
                    <span className="mr-2">
                        <Images />
                    </span>
                    {t("Select Photo")}
                </li>
                <li className="flex items-center p-2 cursor-pointer" onClick={() => handleAction('remove')}>
                    <span className="mr-2">
                        <Trash2 />
                    </span>
                    {t("Remove Photo")}
                </li>
            </ul>
        </div>
    );
};

PhotoAction.propTypes = {
    fileInput: PropTypes.shape({
        current: PropTypes.instanceOf(Element),
    }).isRequired,
    onClose: PropTypes.func.isRequired,
};

export default PhotoAction;
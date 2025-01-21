// components/App/Invitation.jsx

import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next'; // Assuming you're using react-i18next for translations
import { useHistory } from 'react-router-dom';
import { Button } from '../ui/button';
import { useTimeAgo } from '@/utils/app';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';


const Invitation = ({ model }: { model: any }) => {
    const { t, i18n } = useTranslation();
    const router = useHistory();

    const {timeAgo} = useTimeAgo(model.invitation_created_at, t);

    useEffect(() => {
        //router.prefetch("/invitation/[id]")
    }, []);

    const invitationDetail = () => {
        router.push(`/invitation/${model.invitation_uuid}`);
    };

    return (
        model.request && model.company && (
            <Card onClick={invitationDetail} className="cursor-pointer rounded-lg shadow-md bg-white mb-4">
                <CardHeader className="ion-card-header">
                    <div className={`status py-2 px-3 rounded-lg ${model.request.request_status === 'delivered' ? 'bg-green-100' : 
                        model.request.request_status === 'cancelled' ? 'bg-red-100' : 'bg-yellow-100'}`}>

                        {model.request.request_status === 'started' || model.request.request_status === 're_work' || 
                        model.request.request_status === 'finished_by_recruitment' ? (
                            <>
                                {model.invitation_status === 1 && !model.suggestion && <span className="txt">{t("New Job Invitation!")}</span>}
                                {model.invitation_status === 3 && !model.suggestion && <span className="txt">{t("We're now working on convincing them to hire you. Check back here later to see if you made it.")}</span>}
                                {model.invitation_status === 3 && model.suggestion && model.suggestion.suggestion_status && 
                                    <span className="txt">{t("Congratulation, You profile has been shortlisted by Client.")}</span>}
                                {model.invitation_status === 2 && <span className="txt">{t("We’ll keep you updated on any other jobs that pop up.")}</span>}
                            </>
                        ) : model.request.request_status === 'delivered' ? (
                            <>
                                {model.invitation_status === 1 && <span>{t("You didn’t apply for it.")}</span>}
                                {model.invitation_status === 2 && <span>{t("You rejected it.")}</span>}
                                {model.invitation_status === 3 && <span>{t("You applied.")}</span>}
                                <span className="txt">{t("This job has filled up. If you didn’t make it, we’ll be working on finding you other jobs.")}</span>
                            </>
                        ) : model.request.request_status === 'cancelled' && <span>{t("This job was cancelled. They’ll hopefully have another opening soon.")}</span>}
                    </div>
                </CardHeader>

                <CardContent className="ion-card-content p-4 pt-0">
                    <p className="font-bold text-lg text-gray-900">{model.request.request_position_title}</p>
                    <p className="font-semibold text-blue-600">
                        {model.company[i18n.language === 'en' ? 'company_common_name_en' : 
                            'company_common_name_ar'] || model.company.company_name}
                    </p>
                    <small className="text-gray-500">{ timeAgo }</small>

                    <div className="badge my-3">
                        {model.request.request_position_type === 1 && 
                            <span className="ion-badge bg-gray-200 rounded-lg text-gray-600 font-medium px-4 py-2">{t("full-time")}</span>}
                        {model.request.request_position_type === 2 && 
                            <span className="ion-badge bg-gray-200 rounded-lg text-gray-600 font-medium px-4 py-2">{t("part-time")}</span>}
                    </div>

                    {(model.request.request_status === 'started' || model.request.request_status === 're_work' || 
                    model.request.request_status === 'finished_by_recruitment') && model.invitation_status === 1 
                    && (
                        <Button onClick={invitationDetail} className="tell-me-more-btn mt-4 h-10 rounded-md bg-blue-600 text-white w-full">
                            {t("View details & apply for job")}
                        </Button>
                    )}
                </CardContent>

                {model.reply && (
                    <CardFooter className="ion-card-content reply border-t border-gray-300 pt-4">
                        <h3 className="font-medium text-gray-900">{t("You reply:")}</h3>
                        <p className="application-msg text-gray-600">
                            "<span dangerouslySetInnerHTML={{ __html: model.reply.note_text }}></span>"
                        </p>
                    </CardFooter>
                )}
            </Card>
        )
    );
};

Invitation.propTypes = {
    model: PropTypes.shape({
        request: PropTypes.shape({
            request_status: PropTypes.string.isRequired,
            request_position_title: PropTypes.string.isRequired,
            request_position_type: PropTypes.number.isRequired,
        }).isRequired,
        company: PropTypes.shape({
            company_common_name_en: PropTypes.string,
            company_common_name_ar: PropTypes.string,
            company_name: PropTypes.string.isRequired,
        }).isRequired,
        invitation_created_at: PropTypes.string.isRequired,
        invitation_status: PropTypes.number.isRequired,
        invitation_uuid: PropTypes.string.isRequired,
        reply: PropTypes.shape({
            note_text: PropTypes.string.isRequired,
        }),
        suggestion: PropTypes.shape({
            suggestion_status: PropTypes.bool,
        }),
    }).isRequired,
};

export default Invitation;

// Tailwind CSS styles are applied directly in the component


import JobComponent from "@/components/app/jobs/job";
import { Suspense, useEffect, useState } from "react";
import Loading from "./loading";
import { Job } from "@/models/job";
import { page, track } from "@/providers/analytics.service";
import { useIonRouter } from "@ionic/react";    
import { listJobs } from "@/providers/logged-in/job.service";
import Pager from "@/components/common/pager";
import { useTranslation } from "react-i18next";
import DashLayout from "../layout";
import NoItems from "@/components/common/no-items";

export default function JobsPage() {

    const { t } = useTranslation();

    const [loading, setLoading] = useState(false);
    const [segment, setSegment] = useState('jobs');
    const [query, setQuery] = useState('');

    const router = useIonRouter();

    const [jobs, setJobs] = useState<Job[]>([]);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
    });

    useEffect(() => {
        
        page('Jobs Page');

        //router.prefetch('/jobs/[id]')

        return () => {
            track('page_exit', { page: 'Jobs Page' });
        }
    }, []);

    useEffect(() => {   
        loadData();
    },[segment, query]);

    const loadData = async (page = 1) => {
        setLoading(true);

        let params = "&q=" + query;
        
        if(segment == 'applications') {
            params += '&applied=true';
        }
        
        const response = await listJobs(page, params);
         
        setJobs(response.data);

        setPagination({
            current_page: parseInt(response.headers.get('x-pagination-current-page')),
            total_pages: parseInt(response.headers.get('x-pagination-page-count')),
            total_count: parseInt(response.headers.get('X-Pagination-Total-Count')),
        });

        setLoading(false);
    };

    const loadPage = (page: number) => {

        if ((page > 1 && page > pagination.total_pages) || page < 1) {
            return;
        }

        setPagination({
            ...pagination,
            current_page: page
        });

        loadData(page);
    }
    

    function changeSegment(segment: string) {

        setPagination({
            current_page: 1,
            total_pages: 1,
            total_count: 0,
        });

        setSegment(segment);
    }

    async function sleep(ms: number) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    return (
        <Suspense fallback={<Loading />}>
            <DashLayout>
            <div className=' bg-white'>
                <div className="max-w-4xl mx-auto px-6 shadow-[0px_10px_20px_0px_rgba(0,0,0,0.05) xs:pt-0 sm:pt-6 pb-6">

                    <h5 className='text-[color:var(--Neutral-95,#23233D)] text-2xl font-bold leading-8 capitalize'>
                        {t('Jobs for you')}
                    </h5>
                </div>
            </div>
            <div className="max-w-4xl mx-auto p-6">

                <div className="mb-2.5 h-[42px] p-[5px] bg-slate-100 rounded-md flex">
                    <div onClick={() => changeSegment('jobs')} className={ `cursor-pointer grow shrink basis-0 h-8 px-3 py-1.5 rounded-[3px] gap-2.5 flex justify-center text-center ${segment == 'jobs'? 'bg-white text-slate-900': 'text-slate-700 leading-tight'} text-sm font-medium` }>
                        {t('Available Positions')}
                    </div>
                    <div onClick={() => changeSegment('applications')} className={ `cursor-pointer grow shrink basis-0 h-8 px-3 py-1.5 rounded-[3px] gap-2.5 flex justify-center text-center text-sm font-medium ${segment == 'applications'? 'bg-white text-slate-900': 'text-slate-700 leading-tight'}` }>
                        {t('Applications')}
                    </div>
                </div>

                <div className="relative h-10 mb-2.5 w-full self-stretch bg-white rounded-lg shadow-[0px_4px_6px_0px_rgba(0,0,0,0.09)] border border-slate-200">

                    <div className="me-2 my-2.5 absolute start-4 top-[2px]">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <g opacity="0.5">
                                <path d="M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                <path d="M14 14L11.1 11.1" stroke="#0F172A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </g>
                        </svg>
                    </div>

                    <input type="text"  placeholder={ t("Search by job positions...") }
                        onChange={async (e) => {
                            await sleep(700)
                            setQuery(e.target.value);
                        }}
                        className="focus:outline-0 focus:ring-0 w-full self-stretch h-10 gap-2.5 ps-10 pe-4 py-2.5 bg-white rounded-lg text-slate-400 text-sm font-normal leading-tight" />

                </div>

                {!loading && jobs.length === 0 && (
                    <>
                        { query.length == 0 && segment == 'jobs' && <NoItems image="assets/icons/no-invitation.svg" 
                            title={ t('We will list matching jobs here!') }
                            message={ t('Our team is working hard to find you the suitable jobs for you. Stay tight!') } />
                        }
                        { query.length == 0 && segment == 'applications' && <NoItems image="assets/icons/no-invitation.svg" 
                            title={ t('Your job applications will be listed here!') }
                            message={ t('You can see the status of your applications here.') } />
                        }
                        {
                            query.length > 0 && segment == 'jobs' && <NoItems image="assets/icons/no-invitation.svg" 
                                title={ t('No matching jobs found!') }
                                message={ t("We couldn't find any jobs matching your search. Try a different search term.") } />       
                        }
                        {
                            query.length > 0 && segment == 'applications' && <NoItems image="assets/icons/no-invitation.svg" 
                                title={ t('No matching applications found!') }
                                message={ t("We couldn't find any applications matching your search. Try a different search term.") } />       
                        }
                    </>
                )}

                {jobs.map((job: Job) => (
                    <JobComponent key={job.job_uuid} job={job} />
                ))}

                <Pager pagination={pagination} loadPage={loadPage} />   
            </div>
            </DashLayout>
        </Suspense>
    )
}
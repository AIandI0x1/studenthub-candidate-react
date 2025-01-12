import { Candidate } from './candidate';
import { Company } from './company';
import { JobInterest } from './job-interest';
import { Request } from './request';
import {Suggestion} from "./suggestion";

export class Invitation {
    invitation_uuid?: string;
    candidate_id?: number;
    request_uuid?: string;
    job_interest_uuid?: string;
    invitation_status?: number;// (1-Invited , 2- rejected, 3- accepted)
    invitation_app_seen_at?: string;
    invitation_email_seen_at?: string;
    invitation_created_by?: number;
    invitation_updated_by?: number;
    invitation_created_at?: string;
    invitation_updated_at?: string;
    candidate?: Candidate;
    request!: Request;
    company!: Company;
    suggestion?: Suggestion;
    note?: any;
    reply?: any;
    jobInterest?: JobInterest;
}

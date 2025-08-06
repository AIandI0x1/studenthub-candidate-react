import { Degree } from "./degree";
import { Major } from "./major";
import { University } from "./university";

export type EducationType = 'standard' | 'custom_university' | 'studying_abroad' | 'not_studying';

export class CandidateEducation {
    education_uuid?: string;
    candidate_id?: number;
    university_id?: number | null;
    degree_uuid?: string | null; 
    major_uuid?: string | null;
    graduation_year?: number | null;
    is_currently_studying?: boolean;
    education_type?: EducationType;
    custom_institution_name?: string | null;
    created_at?: string;
    updated_at?: string;
    major?: Major;
    degree?: Degree;
    university?: University;

    constructor(init?: Partial<CandidateEducation>) {
        Object.assign(this, {
            education_type: 'standard',
            is_currently_studying: false,
            ...init
        });
    }
}
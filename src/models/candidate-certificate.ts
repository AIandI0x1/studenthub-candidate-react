export class CandidateCertificate {
    certificate_uuid!: string;
    certificate_type!: string;
    candidate_id!: number;
    candidate_work_history_id?: number;
    exam_uuid!: string;
    store_id?: number;
    company_id?: number;
    parent_company_id ?: number;
    start_date !: string;
    end_date !: string;
    staff_id !: number;
    is_deleted !: boolean;
    created_at !: string;
    updated_at !: string;
}
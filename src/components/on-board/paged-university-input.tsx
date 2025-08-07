import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
  } from "@/components/ui/pagination"
  
import { CheckIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import { filterUniversities } from "@/providers/university.service";
import { FormInput } from "../ui/form-input";
import { Card, CardContent } from "../ui/card";
import { langContent } from "@/utils/common";
import { CandidateEducation, EducationType } from "@/models/candidate-education";

interface UniversityInputProps {
    educationDetail: CandidateEducation;
    onSelect: (university: any) => void;
    name: string;
    custom_institution_name: string;
    form: any;
    required?: boolean;
}

type SpecialOption = {
    id: string;
    type: EducationType;
    label: string;
    inputPlaceholder?: string;
};

const SPECIAL_OPTIONS: SpecialOption[] = [
    {
        id: 'custom_university',
        type: 'custom_university',
        label: '+ Add Other University/School',
        inputPlaceholder: 'Enter your university or school name'
    },
    {
        id: 'studying_abroad',
        type: 'studying_abroad',
        label: 'Studying outside of Kuwait',
        inputPlaceholder: 'Enter institution name and country'
    },
    {
        id: 'not_studying',
        type: 'not_studying',
        label: 'Not Currently Studying'
    }
];

export default function PagedUniversityInput({ educationDetail, onSelect, name, custom_institution_name, form, required = false }: UniversityInputProps) {

    const [open, setOpen] = React.useState(false)
    const [loading, setLoading] = useState(false);
    const [universityList, setUniversityList] = useState([]);
    const [showCustomInput, setShowCustomInput] = useState(false);
    const [selectedOption, setSelectedOption] = useState<SpecialOption | null>(null);

    const [pagination, setPagination] = useState({
        current_page: 1,
        total_pages: 1,
        total_count: 0,
    });
    
    const selectedUniversity = educationDetail.university;

    // Initialize form values in useEffect
    useEffect(() => {
        if(educationDetail.education_type !== 'standard'){
            handleSelect(SPECIAL_OPTIONS.find(opt => opt.type === educationDetail.education_type));
        }
    }, [educationDetail, form]);

    useEffect(() => {
         
        if (!open || form.getValues(name) == "") {
            return;
        }

        loadPage(1)

    }, [form.watch(name)])
 
    const handleSelect = (option: any) => {
        if (option.type) {
            // Handle special options
            setSelectedOption(option);
            setShowCustomInput(option.type === 'custom_university' || option.type === 'studying_abroad');
            
            onSelect({
                ...option,
                is_special: true
            });
        } else {
            // Handle regular university selection
            setSelectedOption(null);
            setShowCustomInput(false);
            onSelect(option);
        }
        
        setOpen(false);
        setUniversityList([]);
    };
 
    const onFocus = () => {
        if (!open) {
            setOpen(true);
            // Load initial data when first opening
            if (universityList.length === 0) {
                loadPage(1);
            }
        }
    }

    const loadPage = (page: number) => {
        if ((page > 1 && page > pagination.total_pages) || page < 1) {
            return;
        }

        setLoading(true);
        const searchTerm = selectedOption ? '' : (form.getValues(name) || '');
 
        filterUniversities(searchTerm, page, 5).then((res) => {
            setUniversityList(res.data);
            setPagination({
                current_page: parseInt(res.headers.get('x-pagination-current-page') || '1'),
                total_pages: parseInt(res.headers.get('x-pagination-page-count') || '1'),
                total_count: parseInt(res.headers.get('x-pagination-total-count') || '0'),
            });
        }).finally(() => {
            setLoading(false);
        });
    }

    return (
        <div>
            
        <div className="relative">
                <FormInput
                    onFocus={() => onFocus()}
                    name={name}
                    label={form.getValues(name) == "" ? "Search University/School" : "University/School"}
                    form={form as any}
                    autoComplete="off"
                    required={required}
                />

            {/* Dropdown with special options and university list */}
            <div className={`absolute top-full left-0 w-full z-50 ${!open ? 'hidden' : ''}`}>
                <Card className="mt-2 border-gray-300 rounded-2xl overflow-hidden">
                    <CardContent className="p-0">
                        <ul className="max-h-60 overflow-auto">
                            {/* Special options */}
                            {SPECIAL_OPTIONS.map((option) => (
                                <li 
                                    key={option.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                    onClick={() => handleSelect(option)}
                                >
                                    <span className="flex-1 text-sm font-medium">{option.label}</span>
                                </li>
                            ))}
                            
                            {/* Divider - Only show if there are both special options and universities */}
                            {(SPECIAL_OPTIONS.length > 0 && universityList.length > 0) && (
                                <li className="border-t border-gray-200 my-1"></li>
                            )}
                            
                            {/* University list */}
                            {loading ? (
                                <li className="p-4 text-center text-sm text-gray-500">Loading...</li>
                            ) : (
                                universityList.map((university: any) => (
                                    university && (
                                        <li 
                                            key={university.university_id} 
                                            className="p-2 hover:bg-gray-100 cursor-pointer flex items-center"
                                            onClick={() => handleSelect(university)}
                                        >
                                            <span className="flex-1 text-sm">
                                                {langContent(university.university_name_en, university.university_name_ar)}
                                            </span>
                                            <CheckIcon
                                                className={`ml-auto size-4 ${university.university_id === selectedUniversity?.university_id ? "opacity-100" : "opacity-0"}`}
                                            />
                                        </li>
                                    )
                                ))
                            )}
                        </ul>

                { /* pagination.total_pages > 1 && (
                    <Pagination>
                        <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                className="cursor-pointer"
                                onClick={() => loadPage(pagination.current_page - 1)} />
                        </PaginationItem>

                        {/**Math.min(pagination.total_pages, 2) *
                        {Array.from({ length: pagination.total_pages }, (_, i) => i + 1).map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink 
                                    className="cursor-pointer"
                                    onClick={() => loadPage(page)}
                                    isActive={page === pagination.current_page}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                         
                         {/*
                            pagination.total_pages > 2 && (
                                <PaginationEllipsis />
                            )
                         *}

                        <PaginationItem>
                            <PaginationNext 
                                className="cursor-pointer"
                                onClick={() => loadPage(pagination.current_page + 1)} />
                        </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )  
                */}
                    </CardContent>
                </Card>
            </div>
                
            
        </div> 
        {showCustomInput && selectedOption && (
                <div className="mt-2">
                    <FormInput
                        name={custom_institution_name}
                        label={selectedOption.label}
                        form={form as any}
                        autoComplete="off"
                        required
                    />
                </div>
            )}
        </div>
        
    )
}
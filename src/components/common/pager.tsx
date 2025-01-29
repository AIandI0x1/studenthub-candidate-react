import { Pagination, PaginationLink, PaginationNext, PaginationContent, PaginationItem, PaginationPrevious } from "../ui/pagination";

interface IPagerProps {
    pagination: {
        total_pages: number | null;
        current_page: number | null;
        total_count: number | null;
    };
    loadPage: (page: number) => void;
}

export default function Pager({ pagination, loadPage }: IPagerProps) {
    return (
        pagination.total_pages != null && pagination.total_pages > 1 && (
            <Pagination>
            <PaginationContent>
            <PaginationItem>
                <PaginationPrevious 
                    className="cursor-pointer"
                    onClick={() => pagination.current_page && loadPage(pagination.current_page - 1)} />
            </PaginationItem>

            {/**Math.min(, 2) */}

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
            */}

            <PaginationItem>
                <PaginationNext 
                    className="cursor-pointer"
                    onClick={() => pagination.current_page && loadPage(pagination.current_page + 1)} />
            </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    );
};
import { Pagination, PaginationLink, PaginationEllipsis, PaginationNext, PaginationContent, PaginationItem, PaginationPrevious } from "../ui/pagination";

interface IPagerProps {
    pagination: {
        total_pages: number;
        current_page: number;
    };
    loadPage: (page: number) => void;
}

export default function Pager({ pagination, loadPage }: IPagerProps) {
    return (
        pagination.total_pages > 1 && (
            <Pagination>
            <PaginationContent>
            <PaginationItem>
                <PaginationPrevious 
                    className="cursor-pointer"
                    onClick={() => loadPage(pagination.current_page - 1)} />
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
                    onClick={() => loadPage(pagination.current_page + 1)} />
            </PaginationItem>
                </PaginationContent>
            </Pagination>
        )
    );
};
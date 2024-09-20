import { Button } from "../ui/button";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationLink,
    PaginationPrevious,
    PaginationEllipsis,
    PaginationNext,
} from "../ui/pagination";
import { type PaginationFooterProps } from "@/utils/types/shared.types";
import { useMemo } from "react";

export const PaginationFooter: React.FC<PaginationFooterProps> = ({
    disabled = false,
    pagination,
    onChangePaginationHandler,
}) => {
    const prevEnabled = useMemo<boolean>(
        () => !disabled && (pagination?.page_number || 0) > 0,
        [disabled, pagination],
    );

    const nextEnabled = useMemo<boolean>(
        () => !disabled && (pagination?.has_more ?? false),
        [disabled, pagination],
    );

    return pagination ? (
        <Pagination className="flex select-none items-center justify-between">
            <Button variant="ghost" disabled>
                {pagination.page_size} rows per page
            </Button>

            <PaginationContent>
                <PaginationItem>
                    <PaginationPrevious
                        onClick={() => {
                            if (prevEnabled)
                                onChangePaginationHandler({
                                    ...pagination,
                                    page_number: pagination.page_number - 1,
                                });
                        }}
                        className={`${prevEnabled ? "cursor-pointer" : ""}`}
                    />
                </PaginationItem>

                {pagination.page_number > 0 ? (
                    <PaginationItem>
                        <PaginationLink
                            onClick={() => {
                                if (prevEnabled)
                                    onChangePaginationHandler({
                                        ...pagination,
                                        page_number: pagination.page_number - 1,
                                    });
                            }}
                            className={`${prevEnabled ? "cursor-pointer" : ""}`}
                        >
                            {pagination.page_number}
                        </PaginationLink>
                    </PaginationItem>
                ) : (
                    <></>
                )}

                <PaginationItem>
                    <PaginationLink isActive className="cursor-default">
                        {pagination.page_number + 1}
                    </PaginationLink>
                </PaginationItem>

                {pagination.has_more ? (
                    <>
                        <PaginationItem>
                            <PaginationLink
                                onClick={() => {
                                    if (nextEnabled)
                                        onChangePaginationHandler({
                                            ...pagination,
                                            page_number:
                                                pagination.page_number + 1,
                                        });
                                }}
                                className={`${nextEnabled ? "cursor-pointer" : ""}`}
                            >
                                {pagination.page_number + 2}
                            </PaginationLink>
                        </PaginationItem>

                        <PaginationItem>
                            <PaginationEllipsis />
                        </PaginationItem>
                    </>
                ) : (
                    <></>
                )}

                <PaginationItem>
                    <PaginationNext
                        onClick={() => {
                            if (nextEnabled)
                                onChangePaginationHandler({
                                    ...pagination,
                                    page_number: pagination.page_number + 1,
                                });
                        }}
                        className={`${nextEnabled ? "cursor-pointer" : ""}`}
                    />
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    ) : (
        <></>
    );
};

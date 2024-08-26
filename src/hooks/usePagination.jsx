import { useState, useMemo } from "react";

export default function usePagination(data) {
    const itemsPerPage = 10;
    const [currentPage, setCurrentPage] = useState(1)

    const totalPages = useMemo(() => Math.ceil(data.length / itemsPerPage), [data.length]);

    const currentItems = useMemo(() => {
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return data.slice(indexOfFirstItem, indexOfLastItem);
    }, [currentPage, data]);

    const paginationNum = useMemo(() => {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }, [totalPages]);

    return {paginationNum, currentPage, setCurrentPage, currentItems}
}
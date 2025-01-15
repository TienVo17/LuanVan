import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SachModel from '../../models/SachModel';
import SachProps from '../products/components/SachProps';

const CategoryPage: React.FC = () => {
    const [sachList, setSachList] = useState<SachModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [sachPerPage] = useState(8);
    const [totalSach, setTotalSach] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const { categoryId } = useParams();

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const baseUrl = `http://localhost:8080/api/sach/the-loai/${categoryId}?page=${currentPage-1}&size=${sachPerPage}`;
                const response = await fetch(baseUrl);

                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const responseJson = await response.json();
                
                // Updated parsing logic to handle direct array response
                const responseData = responseJson.content || [];
                const loadedBooks: SachModel[] = responseData.map((book: any) => ({
                    maSach: book.maSach,
                    tenSach: book.tenSach,
                    giaBan: book.giaBan,
                    giaNiemYet: book.giaNiemYet,
                    moTa: book.moTa,
                    soLuong: book.soLuong,
                    tenTacGia: book.tenTacGia,
                    trungBinhXepHang: book.trungBinhXepHang,
                }));

                setSachList(loadedBooks);
                setTotalPages(responseJson.totalPages);
                setTotalSach(responseJson.totalElements);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        };

        fetchBooks();
    }, [currentPage, categoryId]);

    if (isLoading) {
        return (
            <div className='container m-5'>
                <div className='d-flex justify-content-center'>
                    <div className='spinner-border text-primary' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </div>
                </div>
            </div>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className='container'>
            <div className='row mt-4 mb-4'>
                <h3>Sách theo thể loại</h3>
            </div>
            <div className='row'>
                {sachList.map(sach => (
                    <SachProps key={sach.maSach} sach={sach} />
                ))}
            </div>
            {totalPages > 1 && (
                <div className='row mt-4 mb-4'>
                    <nav aria-label='...'>
                        <ul className='pagination pagination-lg justify-content-center'>
                            <li className='page-item' onClick={() => paginate(1)}>
                                <button className='page-link'>First</button>
                            </li>
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className='page-link' onClick={() => paginate(currentPage - 1)}>
                                    Previous
                                </button>
                            </li>
                            <li className='page-item'>
                                <button className='page-link disabled bg-dark text-white'>
                                    Page {currentPage} of {totalPages}
                                </button>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className='page-link' onClick={() => paginate(currentPage + 1)}>
                                    Next
                                </button>
                            </li>
                            <li className='page-item' onClick={() => paginate(totalPages)}>
                                <button className='page-link'>Last</button>
                            </li>
                        </ul>
                    </nav>
                </div>
            )}
        </div>
    );
};

export default CategoryPage;

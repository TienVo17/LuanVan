import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import SachModel from '../../models/SachModel';
import SachProps from '../products/components/SachProps';
import { PhanTrang } from '../utils/PhanTrang';
import { DANH_SACH_THE_LOAI } from '../../constants/TheLoai';

const CategoryPage: React.FC = () => {
    const [sachList, setSachList] = useState<SachModel[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [httpError, setHttpError] = useState(null);
    const [trangHienTai, setTrangHienTai] = useState(1);
    const [tongSoTrang, setTongSoTrang] = useState(0);
    const { categoryId } = useParams();
    const tenTheLoai = DANH_SACH_THE_LOAI[categoryId as keyof typeof DANH_SACH_THE_LOAI] || 'Không xác định';

    useEffect(() => {
        const fetchBooks = async () => {
            try {
                const baseUrl = `http://localhost:8080/api/sach/the-loai/${categoryId}?page=${trangHienTai-1}&size=8`;
                const response = await fetch(baseUrl);

                if (!response.ok) {
                    throw new Error('Something went wrong!');
                }

                const responseJson = await response.json();
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
                setTongSoTrang(responseJson.totalPages);
                setIsLoading(false);
            } catch (error: any) {
                setIsLoading(false);
                setHttpError(error.message);
            }
        };

        fetchBooks();
    }, [trangHienTai, categoryId]);

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

    const phanTrang = (trang: number) => setTrangHienTai(trang);

    return (
        <div className='container'>
            <div className='row mt-4 mb-4'>
                <div className='col-12 text-center'>
                    <div className='position-relative d-inline-block'>
                        <h3 className='fw-bold display-6'>

                            <span className='text-dark'>『</span> 
                            <span className='text-dark'>{tenTheLoai}</span> 
                            <span className='text-dark'>』</span>
                        </h3>
                        <div className='position-absolute start-50 translate-middle-x' 
                             style={{bottom: '-10px', width: '80px', height: '4px', backgroundColor: '#212529'}}></div>
                    </div>
                </div>
            </div>
            <div className='row'>
                {sachList.map(sach => (
                    <SachProps key={sach.maSach} sach={sach} />
                ))}
            </div>
            <div className='row mt-4 '>
            <PhanTrang
                trangHienTai={trangHienTai}
                tongSoTrang={tongSoTrang}
                phanTrang={phanTrang}
            />
            </div>
        </div>
    );
};

export default CategoryPage;

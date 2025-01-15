import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getOneImageOfOneBook } from '../../api/HinhAnhApi';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { getBookById } from '../../api/SachApi';  // Add this import at the top

interface SanPhamGioHang {
    maSach: number;
    sachDto: {
        tenSach: string;
        giaBan: number;
        hinhAnh: string;
        soLuong?: number; // Add stock quantity
    };
    soLuong: number;
    hinhAnh?: string;
}

const GioHang: React.FC = () => {
    const [gioHang, setGioHang] = useState<SanPhamGioHang[]>([]);
    const navigate = useNavigate();
    const [showToast, setShowToast] = useState(true); // Add this state
    const [productStock, setProductStock] = useState<Record<number, number>>({}); // Add new state for product stock

    const fetchProductStock = async (maSach: number) => {
        try {
            const sachData = await getBookById(maSach);
            return sachData?.soLuong || 0;
        } catch (error) {
            console.error('Error fetching stock:', error);
            return 0;
        }
    };

    useEffect(() => {
        const loadGioHangWithImages = async () => {
            const gioHangData = localStorage.getItem('gioHang');
            if (gioHangData) {
                const parsedGioHang = JSON.parse(gioHangData);
                
                // Fetch stock for all products
                const stockPromises = parsedGioHang.map((item: SanPhamGioHang) => 
                    fetchProductStock(item.maSach)
                );
                const stockResults = await Promise.all(stockPromises);
                
                // Create stock lookup object
                const newProductStock = parsedGioHang.reduce((acc: Record<number, number>, item: SanPhamGioHang, index: number) => {
                    acc[item.maSach] = stockResults[index];
                    return acc;
                }, {});
                
                setProductStock(newProductStock);

                // Update quantities if they exceed stock
                const updatedGioHang = parsedGioHang.map((item: SanPhamGioHang, index: number) => {
                    const currentStock = stockResults[index];
                    if (item.soLuong > currentStock) {
                        toast.warning(`Số lượng sản phẩm "${item.sachDto.tenSach}" đã được điều chỉnh do vượt quá tồn kho`);
                        return { ...item, soLuong: currentStock };
                    }
                    return item;
                });

                // Continue with image loading
                const gioHangWithImages = await Promise.all(
                    updatedGioHang.map(async (item: SanPhamGioHang) => {
                        try {
                            const images = await getOneImageOfOneBook(item.maSach);
                            return {
                                ...item,
                                hinhAnh: images[0]?.urlHinh || ''
                            };
                        } catch (error) {
                            console.error('Error loading image:', error);
                            return item;
                        }
                    })
                );
                
                setGioHang(gioHangWithImages);
                localStorage.setItem('gioHang', JSON.stringify(gioHangWithImages));
            }
        };

        loadGioHangWithImages();
    }, []);

    const handleQuantityChange = (item: SanPhamGioHang, newQuantity: number) => {
        const stockLimit = productStock[item.maSach] || 0;
        
        if (newQuantity > stockLimit) {
            if (showToast) {
                toast.error(`Hiện chỉ còn ${stockLimit} cuốn.`);
                setShowToast(false);
                setTimeout(() => setShowToast(true), 2000);
            }
            return;
        }

        if (newQuantity < 1) {
            if (showToast) {
                toast.error('Số lượng phải lớn hơn 0');
                setShowToast(false);
                setTimeout(() => setShowToast(true), 2000);
            }
            return;
        }

        const newGioHang = gioHang.map(sp =>
            sp.maSach === item.maSach
                ? {...sp, soLuong: newQuantity}
                : sp
        );
        setGioHang(newGioHang);
        localStorage.setItem('gioHang', JSON.stringify(newGioHang));
        window.dispatchEvent(new Event('storage'));
    };

    const handleCheckout = () => {
        const jwt = localStorage.getItem('jwt');
        if (jwt) {
            // Nếu đã đăng nhập, chuyển đến trang thanh toán
            navigate('/thanh-toan');
        } else {
            // Nếu chưa đăng nhập, chuyển đến trang đặt hàng nhanh
            navigate('/dat-hang-nhanh', { 
                state: { returnUrl: '/thanh-toan' } 
            });
        }
    };

    return (
        <div className="container py-5">
            <div className="row">
                <div className="col-12">
                    <div className="card shadow-sm">
                        <div className="card-header bg-dark text-white">
                            <h4 className="mb-0">Giỏ hàng của bạn</h4>
                        </div>
                        <div className="card-body">
                            {gioHang.length === 0 ? (
                                <div className="text-center py-5">
                                    <i className="fas fa-shopping-cart fa-3x text-muted mb-3"></i>
                                    <h5 className="text-muted">Giỏ hàng trống</h5>
                                    <Link to="/" className="btn bg-dark mt-3">
                                        Tiếp tục mua sắm
                                    </Link>
                                </div>
                            ) : (
                                <>
                                    <div className="table-responsive">
                                        <table className="table table-hover align-middle">
                                            <thead className="table-light">
                                                <tr>
                                                    <th scope="col" style={{ width: '100px' }}>Hình ảnh</th>
                                                    <th scope="col">Tên sách</th>
                                                    <th scope="col" className="text-end">Đơn giá</th>
                                                    <th scope="col" className="text-center" style={{ width: '150px' }}>Số lượng</th>
                                                    <th scope="col" className="text-end">Thành tiền</th>
                                                    <th scope="col" style={{ width: '100px' }}></th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {gioHang.map((item) => (
                                                    <tr key={item.maSach}>
                                                        <td>
                                                            <img 
                                                                src={item.hinhAnh || item.sachDto.hinhAnh} 
                                                                alt={item.sachDto.tenSach} 
                                                                className="img-fluid rounded"
                                                                style={{maxWidth: '80px'}}
                                                            />
                                                        </td>
                                                        <td>
                                                            <h6 className="mb-0">{item.sachDto.tenSach}</h6>
                                                        </td>
                                                        <td className="text-end">
                                                            {item.sachDto.giaBan.toLocaleString()}đ
                                                        </td>
                                                        <td>
                                                            <div className="d-flex justify-content-center align-items-center">
                                                                <button 
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => handleQuantityChange(item, item.soLuong - 1)}
                                                                    disabled={item.soLuong <= 1}
                                                                >-</button>
                                                                <input
                                                                    className="form-control form-control-sm text-center mx-2"
                                                                    style={{width: '50px'}}
                                                                    type="number"
                                                                    value={item.soLuong}
                                                                    onChange={(e) => {
                                                                        const newQuantity = parseInt(e.target.value);
                                                                        if (!isNaN(newQuantity)) {
                                                                            handleQuantityChange(item, newQuantity);
                                                                        }
                                                                    }}
                                                                />
                                                                <button 
                                                                    className="btn btn-sm btn-outline-secondary"
                                                                    onClick={() => handleQuantityChange(item, item.soLuong + 1)}
                                                                    disabled={item.soLuong >= (productStock[item.maSach] || 0)}
                                                                >+</button>
                                                            </div>
                                                        </td>
                                                        <td className="text-end fw-bold">
                                                            {(item.sachDto.giaBan * item.soLuong).toLocaleString()}đ
                                                        </td>
                                                        <td>
                                                            <button 
                                                                className="btn btn-outline-danger btn-sm"
                                                                onClick={() => {
                                                                    const newGioHang = gioHang.filter(
                                                                        (sp) => sp.maSach !== item.maSach
                                                                    );
                                                                    setGioHang(newGioHang);
                                                                    localStorage.setItem('gioHang', JSON.stringify(newGioHang));
                                                                    window.dispatchEvent(new Event('storage'));
                                                                }}
                                                            >
                                                                <i className="fas fa-trash"></i>
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                    <div className="card mt-4">
                                        <div className="card-body">
                                            <div className="row">
                                                <div className="col-md-6">
                                                    <Link to="/" className="btn btn-outline-primary">
                                                        <i className="fas fa-arrow-left me-2"></i>
                                                        Tiếp tục mua sắm
                                                    </Link>
                                                </div>
                                                <div className="col-md-6 text-end">
                                                    <div className="h5 mb-3">
                                                        Tổng thanh toán: <span className="text-primary">
                                                            {gioHang.reduce((total, item) => total + item.sachDto.giaBan * item.soLuong, 0).toLocaleString()}đ
                                                        </span>
                                                    </div>
                                                    <button className="btn bg-dark text-white"
                                                        onClick={handleCheckout}
                                                    >
                                                        Thanh toán ngay
                                                        <i className="fas fa-arrow-right ms-2"></i>
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GioHang;
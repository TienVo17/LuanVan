import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

interface FormData {
    hoTen: string;
    soDienThoai: string;
    diaChiNhanHang: string;
}

interface CartItem {
    maSach: number,
    sachDto: {
        giaBan: number;
        tenSach: string;
    };
    soLuong: number;
}

const DatHangNhanh: React.FC = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState<FormData>({
        hoTen: "",
        soDienThoai: "",
        diaChiNhanHang: "",
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        if (!formData.hoTen || !formData.soDienThoai || !formData.diaChiNhanHang) {
            toast.error("Vui lòng điền đầy đủ thông tin");
            setIsLoading(false);
            return;
        }

        try {
            const gioHang = localStorage.getItem("gioHang");
            const cartItems: CartItem[] = JSON.parse(gioHang || "[]");
            console.log('cartItems', cartItems)
            if (cartItems.length === 0) {
                toast.error("Giỏ hàng trống!");
                setIsLoading(false);
                return;
            }

            // Calculate total first
            const tongTien = cartItems.reduce(
                (total, item) => total + item.sachDto.giaBan * item.soLuong,
                0
            );

            const queryParams = new URLSearchParams({
                hoTen: formData.hoTen,
                soDienThoai: formData.soDienThoai,
                diaChiNhanHang: formData.diaChiNhanHang,
            });

            const data = {
                hoTen: formData.hoTen,
                soDienThoai: formData.soDienThoai,
                diaChiNhanHang: formData.diaChiNhanHang,
                maSach: cartItems[0].maSach,
                soLuong: cartItems[0].soLuong,
                tongTien: tongTien
            }

            const response = await fetch(
                `http://localhost:8080/api/don-hang/them-don-hang-moi`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(data),
                }
            );

            if (!response.ok || response.status === 204) {
                toast.error("Đặt hàng thất bại. Vui lòng thử lại.");
                setIsLoading(false);
                return;
            }

            const text = await response.text();
            const donHang = text ? JSON.parse(text) : null;

            if (donHang && donHang.maDonHang) {
                localStorage.setItem(
                    "orderData",
                    JSON.stringify({
                        formData,
                        cartItems,
                        tongTien,
                        maDonHang: donHang.maDonHang,
                    })
                );
                toast.success("Đặt hàng thành công!");
                navigate("/thanh-toan");
            } else {
                throw new Error("Invalid order data received");
            }
        } catch (error) {
            console.error("Lỗi đặt hàng:", error);
            toast.error("Có lỗi xảy ra khi đặt hàng");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container py-5">
            <div className="row justify-content-center">
                <div className="col-12 col-md-8 col-lg-6">
                    <div className="card border-0">
                        <div className="card-header bg-primary bg-gradient text-white text-center p-4">
                            <h3 className="mb-2 fw-bold">
                                <i className="bi bi-cart-check-fill me-2"></i>
                                Đặt hàng nhanh
                            </h3>
                            <small className="text-white-50">Vui lòng điền thông tin của bạn</small>
                        </div>

                        <div className="card-body p-4 bg-light">
                            <form onSubmit={handleSubmit} className="needs-validation">
                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-person-circle me-2"></i>Họ tên
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white">
                                            <i className="bi bi-person"></i>
                                        </span>
                                        <input
                                            type="text"
                                            className="form-control py-2"
                                            value={formData.hoTen}
                                            onChange={(e) =>
                                                setFormData({ ...formData, hoTen: e.target.value })
                                            }
                                            required
                                            placeholder="Nhập họ tên của bạn"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-telephone me-2"></i>Số điện thoại
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white">
                                            <i className="bi bi-phone"></i>
                                        </span>
                                        <input
                                            type="number"
                                            className="form-control py-2"
                                            value={formData.soDienThoai}
                                            onChange={(e) =>
                                                setFormData({ ...formData, soDienThoai: e.target.value })
                                            }
                                            required
                                            placeholder="Nhập số điện thoại"
                                        />
                                    </div>
                                </div>

                                <div className="mb-4">
                                    <label className="form-label fw-semibold">
                                        <i className="bi bi-geo-alt me-2"></i>Địa chỉ nhận hàng
                                    </label>
                                    <div className="input-group">
                                        <span className="input-group-text bg-white">
                                            <i className="bi bi-house"></i>
                                        </span>
                                        <textarea
                                            className="form-control py-2"
                                            value={formData.diaChiNhanHang}
                                            onChange={(e) =>
                                                setFormData({
                                                    ...formData,
                                                    diaChiNhanHang: e.target.value,
                                                })
                                            }
                                            required
                                            rows={3}
                                            placeholder="Nhập địa chỉ nhận hàng"
                                        />
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="btn btn-primary w-100 py-3 text-uppercase fw-bold mt-3"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <div className="d-flex align-items-center justify-content-center">
                                            <div className="spinner-border spinner-border-sm me-2" role="status">
                                                <span className="visually-hidden">Loading...</span>
                                            </div>
                                            Đang xử lý...
                                        </div>
                                    ) : (
                                        <>
                                            <i className="bi bi-bag-check-fill me-2"></i>
                                            Đặt hàng ngay
                                        </>
                                    )}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DatHangNhanh;
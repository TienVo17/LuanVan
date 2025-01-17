import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getOneImageOfOneBook } from "../../api/HinhAnhApi";
import { toast } from "react-toastify";

interface SanPhamGioHang {
  maSach: number;
  sachDto: {
    tenSach: string;
    giaBan: number;
    hinhAnh: string;
  };
  soLuong: number;
  hinhAnh?: string;
}

function ThanhToan() {
  const [gioHang, setGioHang] = useState<SanPhamGioHang[]>([]);

  const [donHang, setDonHang] = useState<any>();
  const navigate = useNavigate();
  useEffect(() => {
    const loadGioHangWithImages = async () => {
      const gioHangData = localStorage.getItem("gioHang");
      if (gioHangData) {
        const parsedGioHang = JSON.parse(gioHangData);
        const gioHangWithImages = await Promise.all(
          parsedGioHang.map(async (item: SanPhamGioHang) => {
            try {
              const images = await getOneImageOfOneBook(item.maSach);
              return {
                ...item,
                hinhAnh: images[0]?.urlHinh || "",
              };
            } catch (error) {
              console.error("Error loading image:", error);
              return item;
            }
          })
        );

        setGioHang(gioHangWithImages);
      }
    };
    loadGioHangWithImages();

    const storedData = localStorage.getItem("gioHang");
    const jwt = localStorage.getItem("jwt");
    const storedOrder = localStorage.getItem("orderData");
    if(storedOrder){
      const data = JSON.parse(storedOrder);
      setDonHang(data);
    }


    if (storedData) {
      const data = JSON.parse(storedData);
      const result = data.map((item: { maSach: any; soLuong: any }) => ({
        maSach: item.maSach,
        soLuong: item.soLuong,
      }));

      // Headers based on authentication status
      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add JWT if authenticated
      if (jwt) {
        headers["Authorization"] = `Bearer ${jwt}`;
      }

      // Choose endpoint based on auth status
      const endpoint = jwt
        ? "http://localhost:8080/api/don-hang/them"
        : "http://localhost:8080/api/don-hang/them-don-hang-moi";

      fetch(endpoint, {
        method: "POST",
        headers: headers,
        body: JSON.stringify(result),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log('datádasdasda', data)
          setDonHang(data);
        })
        .catch((error) => {
          console.error("Lỗi:", error);
        });
    } else {
      console.log("Không có dữ liệu trong localStorage");
    }
  }, []);

  return (
    <div className="container py-5">
      <div className="row">
        <div className="col-12">
          <div className="card shadow">
            <div className="card-header bg-dark text-white d-flex justify-content-between align-items-center p-3">
              <div>
                <h4 className="mb-0">
                  <i className="fas fa-file-invoice me-2"></i>
                  Đơn hàng của bạn
                </h4>
                <small className="text-light opacity-75">Xác nhận thông tin đơn hàng</small>
              </div>
              <div className="border-start ps-3">
                <span className="d-block text-end">Tổng sản phẩm</span>
                <span className="h5 mb-0">{gioHang.length} sản phẩm</span>
              </div>
            </div>
            <div className="card-body">
              {gioHang.length === 0 ? (
                <div className="text-center py-5">
                  <div className="mb-4">
                    <i className="fas fa-shopping-cart fa-4x text-muted"></i>
                  </div>
                  <h5 className="text-muted mb-3">Không có sản phẩm trong đơn hàng</h5>
                  <Link to="/" className="btn btn-dark">
                    <i className="fas fa-arrow-left me-2"></i>
                    Tiếp tục mua sắm
                  </Link>
                </div>
              ) : (
                <>
                  <div className="table-responsive mb-4">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th scope="col" className="text-center" style={{ width: "120px" }}>Hình ảnh</th>
                          <th scope="col" className="text-start" style={{ width: "35%" }}>Tên sách</th>
                          <th scope="col" className="text-center">Đơn giá</th>
                          <th scope="col" className="text-center" style={{ width: "180px" }}>Số lượng</th>
                          <th scope="col" className="text-center">Thành tiền</th>
                          <th scope="col" className="text-center" style={{ width: "80px" }}>Xóa</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gioHang.map((item) => (
                          <tr key={item.maSach}>
                            <td className="text-center">
                              <img
                                src={item.hinhAnh || item.sachDto.hinhAnh}
                                alt={item.sachDto.tenSach}
                                className="img-fluid rounded"
                                style={{ height: "100px", objectFit: "contain" }}
                              />
                            </td>
                            <td className="text-start align-middle">
                              <h6 className="fw-bold mb-0">{item.sachDto.tenSach}</h6>
                            </td>
                            <td className="text-center align-middle">
                              <span className="fw-semibold">{item.sachDto.giaBan.toLocaleString()}đ</span>
                            </td>
                            <td className="align-middle">
                              <div className="d-flex justify-content-center gap-2">
                                <button
                                  className="btn btn-outline-dark btn-sm px-3"
                                  onClick={() => {
                                    if (item.soLuong > 1) {
                                      const newGioHang = gioHang.map((sp) =>
                                        sp.maSach === item.maSach
                                          ? { ...sp, soLuong: sp.soLuong - 1 }
                                          : sp
                                      );
                                      setGioHang(newGioHang);
                                      localStorage.setItem(
                                        "gioHang",
                                        JSON.stringify(newGioHang)
                                      );
                                    }
                                  }}
                                >-</button>
                                <input
                                  className="form-control form-control-sm text-center"
                                  style={{ width: "60px" }}
                                  type="number"
                                  value={item.soLuong}
                                  min={1}
                                  onChange={(e) => {
                                    const soLuongMoi = parseInt(e.target.value);
                                    if (!isNaN(soLuongMoi) && soLuongMoi >= 1) {
                                      const newGioHang = gioHang.map((sp) =>
                                        sp.maSach === item.maSach
                                          ? { ...sp, soLuong: soLuongMoi }
                                          : sp
                                      );
                                      setGioHang(newGioHang);
                                      localStorage.setItem(
                                        "gioHang",
                                        JSON.stringify(newGioHang)
                                      );
                                    }
                                  }}
                                />
                                <button
                                  className="btn btn-outline-dark btn-sm px-3"
                                  onClick={() => {
                                    const newGioHang = gioHang.map((sp) =>
                                      sp.maSach === item.maSach
                                        ? { ...sp, soLuong: sp.soLuong + 1 }
                                        : sp
                                    );
                                    setGioHang(newGioHang);
                                    localStorage.setItem(
                                      "gioHang",
                                      JSON.stringify(newGioHang)
                                    );
                                  }}
                                >+</button>
                              </div>
                            </td>
                            <td className="text-center align-middle">
                              <span className="fw-bold text-primary">
                                {(item.sachDto.giaBan * item.soLuong).toLocaleString()}đ
                              </span>
                            </td>
                            <td className="text-center align-middle">
                              <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() => {
                                  const newGioHang = gioHang.filter(
                                    (sp) => sp.maSach !== item.maSach
                                  );
                                  setGioHang(newGioHang);
                                  localStorage.setItem(
                                    "gioHang",
                                    JSON.stringify(newGioHang)
                                  );
                                  window.dispatchEvent(new Event("storage"));
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

                  <div className="card bg-light border-0 rounded-3">
                    <div className="card-body p-4">
                      <div className="row align-items-center gy-3">
                        <div className="col-md-6">
                          <Link to="/gio-hang" className="btn btn-outline-primary">
                            <i className="fas fa-arrow-left me-2"></i>
                            Giỏ hàng
                          </Link>
                        </div>
                        <div className="col-md-6">
                          <div className="text-md-end">
                            <div className="fs-6 text-muted">Tổng thanh toán</div>
                            <div className="h3 mb-3 text-primary fw-bold">
                              {gioHang
                                .reduce((total, item) => total + item.sachDto.giaBan * item.soLuong, 0)
                                .toLocaleString()}đ
                            </div>
                            <button
                              className="btn btn-dark btn-lg px-5"
                              onClick={() => {
                                if (
                                  !donHang ||
                                  !donHang.tongTien ||
                                  !donHang.maDonHang
                                ) {
                                  console.error(
                                    "Dữ liệu đơn hàng không hợp lệ:",
                                    donHang
                                  );
                                  toast.error(
                                    "Không thể tiến hành thanh toán. Đơn hàng không hợp lệ."
                                  );
                                  return;
                                }

                                fetch(
                                  `http://localhost:8080/api/don-hang/submitOrder?amount=${donHang.tongTien}&orderInfo=${donHang.maDonHang}`,
                                  {
                                    method: "GET",
                                    // headers: {
                                    //   Authorization: `Bearer ${localStorage.getItem(
                                    //     "jwt"
                                    //   )}`,
                                    // },
                                  }
                                )
                                  .then((response) => response.text())
                                  .then((data) => {
                                    console.log(data);
                                    window.location.href = data;
                                  })
                                  .catch((error) => {
                                    console.error("Lỗi:", error);
                                  });
                              }}
                            >
                              <i className="fab fa-cc-visa me-2"></i>
                              Thanh toán VNPAY
                            </button>
                          </div>
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

export default ThanhToan;

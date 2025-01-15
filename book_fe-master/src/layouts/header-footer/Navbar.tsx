import React, { ChangeEvent, useState, useEffect } from "react";
import { Search } from "react-bootstrap-icons";
import { NavLink, useNavigate } from "react-router-dom";
import { findByBook } from "../../api/SachApi";
import { on } from "events";
import { set } from "date-fns";
import NguoiDungModel from "../../models/NguoiDungModel";

interface NavbarProps {
  tuKhoaTimKiem: string;
  setTuKhoaTimKiem: (tuKhoa: string) => void;
}
interface NavbarProps {
  isAdmin?: boolean;
  isUser?: boolean;
  isStaff?: boolean;
}


function Navbar({ tuKhoaTimKiem, setTuKhoaTimKiem }: NavbarProps) {
  const categories = [
    { id: 1, name: "Khoa Học" },
    { id: 2, name: "Tiểu Thuyết" },
    { id: 3, name: "Tâm Lý Học" },
    { id: 4, name: "Lịch Sử" },
    { id: 5, name: "Huyền Bí" }
  ];
  const [tuKhoaTamThoi, setTuKhoaTamThoi] = useState("");
  const [soLuongGioHang, setSoLuongGioHang] = useState(0);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();
  const [jwt, setJwt] = useState(localStorage.getItem("jwt") || "");
  const [userInfo, setUserInfo] = useState<any>(null);
  const [isAdminorStaff, setIsAdminorStaff] = useState(false);

  useEffect(() => {
    const loadSoLuongGioHang = () => {
      const gioHang = JSON.parse(localStorage.getItem("gioHang") || "[]");
      const tongSoLuong = gioHang.reduce(
        (total: number, item: any) => total + item.soLuong,
        0
      );
      setSoLuongGioHang(tongSoLuong);
    };

    loadSoLuongGioHang();

    // Lắng nghe cả storage và cartUpdated event
    window.addEventListener("storage", loadSoLuongGioHang);
    window.addEventListener("cartUpdated", loadSoLuongGioHang);

    return () => {
      window.removeEventListener("storage", loadSoLuongGioHang);
      window.removeEventListener("cartUpdated", loadSoLuongGioHang);
    };
  }, []);

  useEffect(() => {
    if (jwt) {
      try {
        const decodedJwt = JSON.parse(decodeURIComponent(escape(atob(jwt.split('.')[1])))); // Decode JWT
        console.log('JWT Payload:', decodedJwt); // Debug JWT contents
        setUserInfo({
          ...decodedJwt,
          maNguoiDung: decodedJwt.id || decodedJwt.maNguoiDung // Try both possible field names
        });
        
        if (decodedJwt.isAdmin || decodedJwt.isStaff) {
          setIsAdminorStaff(true);
        }
      } catch (error) {
        console.error('Error decoding JWT:', error);
      }
    }
  }, [jwt]);

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    setJwt("");
    navigate("/");
  };
  useEffect(() => {
    setTuKhoaTamThoi(tuKhoaTimKiem); // Đồng bộ hóa tuKhoaTimKiem với state của input
  }, [tuKhoaTimKiem]);

  const onSearchInputChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const searchValue = e.target.value;
    setTuKhoaTamThoi(searchValue);
    
    // If search value is empty, immediately trigger search to load all books
    if (searchValue.trim() === '') {
      setTuKhoaTimKiem('');
      await findByBook('', 0);
    }
  };

  const onSearchSubmit = async () => {
    setTuKhoaTimKiem(tuKhoaTamThoi);
    const result = await findByBook(tuKhoaTamThoi, 0);
    console.log(result);
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <div className="container-fluid">
        <a className="navbar-brand" href="#">
          Bookstore
        </a>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink className="nav-link active" aria-current="page" to="/">
                Trang chủ
              </NavLink>
            </li>
            <li className="nav-item dropdown">
              <NavLink
                className="nav-link dropdown-toggle"
                to="#"
                id="navbarDropdown1"
                role="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Thể loại sách
              </NavLink>
              <ul className="dropdown-menu" aria-labelledby="navbarDropdown1">
                {categories.map(category => (
                  <li key={category.id}>
                    <NavLink 
                      className="dropdown-item" 
                      to={`/the-loai/${category.id}`}
                    >
                      {category.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/sales-policy">
                Quy định bán hàng
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink className="nav-link" to="/about">
                Liên hệ
              </NavLink>
            </li>
          </ul>
        </div>

        {/* Tìm kiếm */}
        <div className="d-flex">
          <input
            className="form-control me-2"
            type="search"
            placeholder="Tìm kiếm"
            aria-label="Search"
            onChange={onSearchInputChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                onSearchSubmit(); // Gọi hàm tìm kiếm khi nhấn Enter
              }
            }}
            value={tuKhoaTamThoi}
          />
          <button
            className="btn btn-outline-success"
            type="button"
            onClick={onSearchSubmit} // Chỉ thực hiện tìm kiếm khi nhấn nút
          >
            <Search />
          </button>
        </div>


        {/* Biểu tượng giỏ hàng */}
        <ul className="navbar-nav me-1">
          <li className="nav-item">
            <NavLink className="nav-link position-relative" to="/gio-hang">
              <i className="fas fa-shopping-cart"></i>
              {soLuongGioHang > 0 && (
                <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                  {soLuongGioHang}
                </span>
              )}
            </NavLink>
          </li>
        </ul>

        {/* Thay thế phần biểu tượng đăng nhập cũ bằng code mới */}
        <ul className="navbar-nav me-1">
          <li className="nav-item">
            {!jwt ? (
              <NavLink className="nav-link" to="/dang-nhap">
                <i className="fas fa-user"></i>
              </NavLink>
            ) : (
              <div className="dropdown">
                <button
                  className="btn nav-link dropdown-toggle"
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  style={{ border: "none" }}
                >
                  <i className="fas fa-user me-1"></i>
                  {userInfo?.sub || "User"}
                </button>
                <ul
                  className={`dropdown-menu dropdown-menu-end ${
                    isDropdownOpen ? "show" : ""
                  }`}
                  style={{ minWidth: "200px", right: 0, left: "auto" }}
                >
                  <li>
                    <NavLink 
                      to={`/tai-khoan/${userInfo?.maNguoiDung}`} 
                      className="dropdown-item"
                      onClick={(e) => {
                        if (!userInfo?.maNguoiDung) {
                          e.preventDefault();
                          console.error('User ID is undefined');
                        }
                      }}
                    >
                      <i className="fas fa-user me-2"></i>Tài khoản
                    </NavLink>
                  </li>
                  <li>
                    <NavLink to="/order" className="dropdown-item">
                      <i className="fas fa-user me-2"></i>Đơn hàng của tôi
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    {!jwt ? null : isAdminorStaff ? (
                      <NavLink
                        className="dropdown-item"
                        to="/quan-ly/danh-sach-sach"
                      >
                        <i className="fas fa-cog me-2"></i>Quản lý
                      </NavLink>
                    ) : null}
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <button
                      className="dropdown-item text-danger"
                      onClick={handleLogout}
                    >
                      <i className="fas fa-sign-out-alt me-2"></i>Đăng xuất
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </li>
        </ul>
      </div>
    </nav>
  );
}
export default Navbar;

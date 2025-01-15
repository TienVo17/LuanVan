import React, { useEffect, useState } from "react";
import Book from "../../models/Book";
import SachModel from "../../models/SachModel";
import SachProps from "./components/SachProps";
import { PhanTrang } from "../utils/PhanTrang";
import { getAllBook } from "../../api/SachApi";
import { findByBook } from "../../api/SachApi";
interface DanhSachSanPhamProps {
  tuKhoaTimKiem: string;
  maTheLoai: number;
}

function DanhSachSanPham({ tuKhoaTimKiem, maTheLoai }: DanhSachSanPhamProps) {
  const [danhsachQuyenSach, setDanhSachQuyenSach] = useState<SachModel[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState<boolean>(true);
  const [baoLoi, setBaoLoi] = useState<string | null>(null);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(0);
  const [tongSoSach, setSoSach] = useState(0);

  useEffect(() => {
    const loadData = async () => {
      setDangTaiDuLieu(true);
      setBaoLoi(null); // Reset error state on new search
      
      try {
        if (tuKhoaTimKiem === "" && maTheLoai === 0) {
          const kq = await getAllBook(trangHienTai - 1);
          setDanhSachQuyenSach(kq.ketQua);
          setTongSoTrang(kq.tongSoTrang);
        } else {
          const kq = await findByBook(tuKhoaTimKiem, maTheLoai);
          setDanhSachQuyenSach(kq.ketQua || []); // Ensure we always set an array
          setTongSoTrang(kq.tongSoTrang);
        }
      } catch (error) {
        console.error("Lỗi load khi load sách:", error);
        setDanhSachQuyenSach([]); // Reset to empty array on error
      } finally {
        setDangTaiDuLieu(false);
      }
    };

    loadData();
  }, [trangHienTai, tuKhoaTimKiem, maTheLoai]);

  const phanTrang = (trang: number) => setTrangHienTai(trang);

  if (dangTaiDuLieu) {
    return (
      <div className="container">
        <div className="d-flex align-items-center justify-content-center">
          <h1>Đang tải dữ liệu...</h1>
        </div>
      </div>
    );
  }

  if (danhsachQuyenSach.length === 0) {
    return (
      <div className="container">
        <div className="d-flex align-items-center justify-content-center">
          <h1>Không tìm thấy sách phù hợp!</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row mt-4 mb-4">
        {danhsachQuyenSach.map((sach) => (
          <SachProps key={sach.maSach} sach={sach} />
        ))}
      </div>
      <PhanTrang
        trangHienTai={trangHienTai}
        tongSoTrang={tongSoTrang}
        phanTrang={phanTrang}
      />
    </div>
  );
}
export default DanhSachSanPham;

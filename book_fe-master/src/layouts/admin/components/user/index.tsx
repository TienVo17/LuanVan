import React, { useState, useEffect } from 'react';
import SachModel from '../../../../models/SachModel';
import { getAllBook, xoaSach } from '../../../../api/SachApi';
import { Link, useNavigate } from 'react-router-dom';
import { PhanTrang } from '../../../utils/PhanTrang';
import NguoiDungModel from "../../../../models/NguoiDungModel";
import {findAll} from "../../../../api/UserApi";
import { de } from 'date-fns/locale';
import { toast } from 'react-toastify';

export default function UserComponent() {
  const [userList, setUserList] = useState<NguoiDungModel[]>([]);
  const [dangTaiDuLieu, setDangTaiDuLieu] = useState(true);
  const [baoLoi, setBaoLoi] = useState<string | null>(null);
  const [trangHienTai, setTrangHienTai] = useState(1);
  const [tongSoTrang, setTongSoTrang] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [userId, setUserId] = useState<number>();
  const [nguoiDung, setNguoiDung] = useState<string>();
  const [quyenList, setQuyenList] = useState<any[]>([]);
  const [selectedQuyen, setSelectedQuyen] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalError, setModalError] = useState<string>('');
  const navigate = useNavigate();


  useEffect(() => {
    findAll(trangHienTai - 1)
        .then((kq) => {
          setUserList(kq.ketQua);
          setTongSoTrang(kq.tongSoTrang);
          setDangTaiDuLieu(false);
        })
        .catch((error) => {
          setBaoLoi(error.message);
          setDangTaiDuLieu(false);
        });
        
        fetch("http://localhost:8080/api/admin/quyen/findAll", {
          method: "GET",
          headers: {
              "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
              'Content-Type': 'application/json' 
          },})
          .then( (response) => {
              return response.json();
          })
          .then((response) => {
            setQuyenList(response)
          })
          .catch((error) => {
              console.error("Lỗi:", error);
              
          });  
    
  }, [trangHienTai]);

  const phanTrang = (trang: number) => setTrangHienTai(trang);



  const handleAdd = () => {
    try {
      navigate(`/quan-ly/them-sach`);
    } catch (error) {
      setBaoLoi('Có lỗi khi chuyển đến trang cập nhật');
    }
  };

  const handleClose = ()=>{
    setShowModal(false);
    setSelectedQuyen(null);
  }

 const handleCheckboxChange = (maQuyen:any) => {

    if (selectedQuyen === maQuyen) {
      setSelectedQuyen(null);
    } else {
      setSelectedQuyen(maQuyen);
    }
    
  };
  if (dangTaiDuLieu) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (baoLoi) {
    return <div>Có lỗi xảy ra: {baoLoi}</div>;
  }

  return (
    <div className="container-fluid px-4">
      <h1 className="mt-4">Quản lý user</h1>
      <ol className="breadcrumb mb-4">
        <li className="breadcrumb-item"><Link to="/danh-sach-nguoi-dung">User</Link></li>
        <li className="breadcrumb-item active">Danh sách user</li>
      </ol>
      <div className="card mb-4">
        <div className="card-header">
          <i className="fas fa-table me-1"></i>
          Danh sách user
        </div>
        <div className="card-body">
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Mã người dùng</th>
                <th>Họ đệm</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {userList.map((user) => (
                <tr key={user.maNguoiDung}>
                  <td>{user.maNguoiDung}</td>
                  <td>{user.hoDem} </td>
                  <td>{user.ten}</td>
                  <td>{user.email}</td>
                  <td>{user.soDienThoai}</td>
                  <td>
                    <button 
                      className="btn btn-primary btn-sm me-2"
                      onClick={() => {
                        setShowModal(true);
                        setUserId(user.maNguoiDung);
                        setNguoiDung(user.hoDem +" "+user.ten)
                      }}
                    >
                      Phân quyền
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <PhanTrang 
        trangHienTai={trangHienTai}
        tongSoTrang={tongSoTrang}
        phanTrang={phanTrang}
      />
      {/* Modal */}
      {showModal && (
        <>
          <div className="modal-backdrop fade show"></div>
          <div className="modal fade show" 
               style={{ display: 'block' }} 
               tabIndex={-1}
               aria-modal="true"
               role="dialog">
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content border-0 shadow">
                <div className="modal-header bg-primary text-white">
                  <h5 className="modal-title">
                    <i className="fas fa-user-tag me-2"></i>
                    Phân quyền cho {nguoiDung}
                  </h5>
                  <button type="button" 
                          className="btn-close btn-close-white" 
                          onClick={handleClose}
                          aria-label="Close">
                  </button>
                </div>
                <div className="modal-body p-4">
                  {modalError && (
                    <div className="alert alert-danger d-flex align-items-center mb-3" role="alert">
                      <i className="fas fa-exclamation-circle me-2"></i>
                      <div>{modalError}</div>
                    </div>
                  )}
                  <div className="list-group">
                    {quyenList.map((item) => (
                      <label key={item?.maQuyen} 
                             className={`list-group-item list-group-item-action d-flex align-items-center ${
                               selectedQuyen === item.maQuyen ? 'active' : ''
                             }`}>
                        <input
                          type="radio"
                          name="quyen"
                          value={item.maQuyen}
                          checked={selectedQuyen === item.maQuyen}
                          onChange={() => handleCheckboxChange(item.maQuyen)}
                          className="form-check-input me-3"
                        />
                        <span className="flex-grow-1">
                          <i className={`fas fa-${item.maQuyen === 1 ? 'user-shield' : 'user'} me-2`}></i>
                          {item.tenQuyen}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="modal-footer border-top">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleClose}
                    disabled={isSubmitting}
                  >
                    <i className="fas fa-times me-2"></i>
                    Đóng
                  </button>
                  <button 
                    type="button" 
                    className="btn btn-primary"
                    disabled={isSubmitting || selectedQuyen === null}
                    onClick={async () => {
                      try {
                        setIsSubmitting(true);
                        setModalError('');
                        
                        if (!userId) {
                          throw new Error('Không tìm thấy người dùng');
                        }
                
                        const body = {
                          userId: userId,
                          quyenIds: selectedQuyen ? [selectedQuyen] : [] // Đóng gói single value vào array
                        };
                
                        const response = await fetch("http://localhost:8080/api/admin/user/phan-quyen", {
                          method: "POST",
                          body: JSON.stringify(body),
                          headers: {
                            "Authorization": `Bearer ${localStorage.getItem('jwt')}`,
                            'Content-Type': 'application/json'
                          },
                        });
                
                        if (!response.ok) {
                          throw new Error('Có lỗi xảy ra khi phân quyền');
                        }
                
                        toast.success("Phân quyền thành công!");
                        setShowModal(false);
                        setSelectedQuyen(null);
                        
                        // Refresh data
                        setTrangHienTai(1);
                      } catch (error: any) {
                        setModalError(error.message);
                      } finally {
                        setIsSubmitting(false);
                      }
                    }}
                  >
                    {isSubmitting ? (
                      <span>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Đang xử lý...
                      </span>
                    ) : (
                      <>
                        <i className="fas fa-save me-2"></i>
                        Lưu
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export {};
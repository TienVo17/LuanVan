import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

interface UserProfile {
    ten: string;
    email: string;
    soDienThoai: string;
    diaChiMuaHang: string;
    diaChiGiaoHang: string;
}

const ThongTinTaiKhoan: React.FC = () => {
    const { maNguoiDung } = useParams();
    const [profile, setProfile] = useState<UserProfile>({
        ten: '',
        email: '',
        soDienThoai: '',
        diaChiMuaHang: '',
        diaChiGiaoHang: ''
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetchUserProfile();
    }, [maNguoiDung]);

    const fetchUserProfile = async () => {
        try {
            const response = await fetch(`http://localhost:8080/tai-khoan/thong-tin/${maNguoiDung}`, {
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setProfile(data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
            toast.error('Không thể tải thông tin người dùng');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:8080/tai-khoan/cap-nhat/${maNguoiDung}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('jwt')}`
                },
                body: JSON.stringify(profile)
            });

            if (response.ok) {
                toast.success('Cập nhật thông tin thành công!');
                setIsEditing(false);
            } else {
                toast.error('Cập nhật thông tin thất bại!');
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Lỗi khi cập nhật thông tin');
        }
    };

    return (
        <div className="container mt-5">
            <div className="card">
                <div className="card-header bg-dark text-white">
                    <h3 className="mb-0">Thông tin tài khoản</h3>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <label className="form-label">Tên</label>
                            <input
                                type="text"
                                className="form-control"
                                value={profile.ten}
                                onChange={e => setProfile({...profile, ten: e.target.value})}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Email</label>
                            <input
                                type="email"
                                className="form-control"
                                value={profile.email}
                                onChange={e => setProfile({...profile, email: e.target.value})}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Số điện thoại</label>
                            <input
                                type="text"
                                className="form-control"
                                value={profile.soDienThoai}
                                onChange={e => setProfile({...profile, soDienThoai: e.target.value})}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ mua hàng</label>
                            <textarea
                                className="form-control"
                                value={profile.diaChiMuaHang}
                                onChange={e => setProfile({...profile, diaChiMuaHang: e.target.value})}
                                disabled={!isEditing}
                            />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Địa chỉ giao hàng</label>
                            <textarea
                                className="form-control"
                                value={profile.diaChiGiaoHang}
                                onChange={e => setProfile({...profile, diaChiGiaoHang: e.target.value})}
                                disabled={!isEditing}
                            />
                        </div>
                        {isEditing ? (
                            <div>
                                <button type="submit" className="btn btn-primary me-2">
                                    Lưu thay đổi
                                </button>
                                <button 
                                    type="button" 
                                    className="btn btn-secondary"
                                    onClick={() => {
                                        setIsEditing(false);
                                        fetchUserProfile();
                                    }}
                                    >
                                        Hủy
                                    </button>
                                </div>
                            ) : (
                                <button 
                                    type="button" 
                                    className="btn btn-primary"
                                    onClick={() => setIsEditing(true)}
                                >
                                    Chỉnh sửa
                                </button>
                            )}
                        </form>
                </div>
            </div>
        </div>
    );
};

export default ThongTinTaiKhoan;

package com.example.book_be.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "don_hang")
public class DonHang {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ma_don_hang")
    private int maDonHang;
    @Column(name = "ngay_tao")
    private Date ngayTao;
    @Column(name = "dia_chi_mua_hang", length = 512)
    private String diaChiMuaHang;
    @Column(name = "dia_chi_nhan_hang", length = 512)
    private String diaChiNhanHang;
    @Column(name = "tong_tien_san_pham")
    private double tongTienSanPham;
    @Column(name = "chi_phi_giao_hang")
    private double chiPhiGiaoHang;
    @Column(name = "chi_phi_thanh_toan")
    private double chiPhiThanhToan;

    private double tongTien;

    @Column(name = "ho_ten")
    private String hoTen;
    @Column(name = "so_dien_thoai")
    private String soDienThoai;



    @JsonIgnore
    @OneToMany(mappedBy = "donHang", fetch = FetchType.LAZY, cascade = {CascadeType.PERSIST, CascadeType.MERGE, CascadeType.DETACH, CascadeType.REFRESH, CascadeType.REMOVE})
    private List<ChiTietDonHang> danhSachChiTietDonHang;
    @ManyToOne(cascade = {
            CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.PERSIST
    })
    @JsonIgnore
    @JoinColumn(name = "ma_nguoi_dung")
    private NguoiDung nguoiDung;
    @ManyToOne(cascade = {
            CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.PERSIST
    })
    @JsonIgnore
    @JoinColumn(name = "ma_hinh_thuc_thanh_toan")
    private HinhThucThanhToan hinhThucThanhToan;
    @ManyToOne(cascade = {
            CascadeType.DETACH, CascadeType.MERGE, CascadeType.REFRESH, CascadeType.PERSIST
    })
    @JsonIgnore
    @JoinColumn(name = "ma_hinh_thuc_giao_hang")
    private HinhThucGiaoHang hinhThucGiaoHang;

    @Column(name = "trang_thai_thanh_toan")
    private Integer trangThaiThanhToan;

    @Column(name = "trang_thai_giao_hang")
    private Integer trangThaiGiaoHang;

    public void addChiTietDonHang(ChiTietDonHang chiTietDonHang) {
        if (danhSachChiTietDonHang == null) {
            danhSachChiTietDonHang = new ArrayList<>();
        }
        danhSachChiTietDonHang.add(chiTietDonHang);

        chiTietDonHang.setDonHang(this);
    }

}

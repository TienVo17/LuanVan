import React from "react";
import { Container, Card } from "react-bootstrap";
import { motion } from "framer-motion";

export interface SalesPolicyProps {} // Add this line

const SalesPolicy: React.FC<SalesPolicyProps> = () => {
  return (
    <Container fluid className="py-5 bg-light">
      <Container>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Card className="shadow-lg rounded-4 mb-4 border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-primary fw-bold">
                Quy Định Bán Hàng
              </h2>
              <hr className="mb-4" />

              <div className="policy-section">
                <h4 className="text-primary mb-3">
                  <i className="fas fa-shopping-cart me-2"></i>
                  Chính sách đặt hàng
                </h4>
                <ul className="list-unstyled ps-4 mb-4">
                  <li className="mb-2">• Đặt hàng trực tuyến 24/7</li>
                  <li className="mb-2">• Xác nhận đơn hàng qua email</li>
                  <li className="mb-2">• Thanh toán an toàn và bảo mật</li>
                </ul>

                <h4 className="text-primary mb-3">
                  <i className="fas fa-truck me-2"></i>
                  Chính sách vận chuyển
                </h4>
                <ul className="list-unstyled ps-4 mb-4">
                  <li className="mb-2">• Miễn phí vận chuyển cho đơn hàng từ 300.000đ</li>
                  <li className="mb-2">• Thời gian giao hàng: 2-5 ngày làm việc</li>
                  <li className="mb-2">• Đóng gói cẩn thận, an toàn</li>
                </ul>

                <h4 className="text-primary mb-3">
                  <i className="fas fa-exchange-alt me-2"></i>
                  Chính sách đổi trả
                </h4>
                <ul className="list-unstyled ps-4 mb-4">
                  <li className="mb-2">• Đổi trả trong vòng 7 ngày</li>
                  <li className="mb-2">• Sách phải còn nguyên vẹn, không có dấu hiệu sử dụng</li>
                  <li className="mb-2">• Hoàn tiền trong vòng 48h sau khi nhận được hàng trả</li>
                </ul>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </Container>
  );
}

export default SalesPolicy;

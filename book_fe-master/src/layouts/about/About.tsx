import React from "react";
import { Container, Row, Col, Card } from "react-bootstrap";
import { motion } from "framer-motion";

function About() {
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
                Giới thiệu về BookStore
              </h2>
              <hr className="mb-4" />
              <Row className="align-items-center">
                <Col lg={8}>
                  <div className="info-section">
                    <p className="mb-3">
                      <i className="fas fa-store text-primary me-2"></i>
                      <strong>Tên website: </strong>BookStore
                    </p>
                    <p className="mb-3">
                      <i className="fas fa-map-marker-alt text-primary me-2"></i>
                      <strong>Địa chỉ: </strong>TPHCM
                    </p>
                    <p className="mb-3">
                      <i className="fas fa-phone text-primary me-2"></i>
                      <strong>Số điện thoại: </strong>
                      <a href="tel:0348972987" className="text-decoration-none">0348972987</a>
                    </p>
                    <p className="mb-3">
                      <i className="fas fa-envelope text-primary me-2"></i>
                      <strong>Email: </strong>
                      <a href="mailto:tienvovan917@gmail.com" className="text-decoration-none">
                        tienvovan917@gmail.com
                      </a>
                    </p>
                  </div>
                </Col>
                <Col lg={4}>
                  <div className="text-center">
                    <img
                      src={`${process.env.PUBLIC_URL}/image/books/logo.png`}
                      className="img-fluid rounded-circle shadow p-3 bg-white"
                      alt="BookStore Logo"
                      style={{ maxWidth: "200px" }}
                    />
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card className="shadow-lg rounded-4 border-0">
            <Card.Body className="p-4">
              <h2 className="text-center mb-4 text-primary fw-bold">
                Vị trí của chúng tôi
              </h2>
              <hr className="mb-4" />
              <div className="map-container rounded-4 overflow-hidden shadow">
                <iframe
                  width="100%"
                  height="450"
                  src="https://www.openstreetmap.org/export/embed.html?bbox=106.67393%2C10.73398%2C106.68193%2C10.74198&layer=mapnik&marker=10.73798%2C106.67793"
                  style={{ border: 0 }}
                  title="BookStore Location"
                  className="w-100"
                ></iframe>
              </div>
            </Card.Body>
          </Card>
        </motion.div>
      </Container>
    </Container>
  );
}

export default About;

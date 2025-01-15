import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { GoogleLoginButton } from "react-social-login-buttons";
import { toast } from "react-toastify";
import { LoginSocialGoogle } from "reactjs-social-login";
const DangNhap = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [userInfo, setUserInfo] = useState({
    name: "",
    email: "",
    imageUrl: "",
  });
  const handleGoogleLoginSuccess = async(response: any) => {
    console.log("Google Login Success:", response);
    const url = `http://localhost:8080/nguoi-dung/search/existsByEmail?email=${response.data.email}`;
    try {
      const responses = await fetch(url);
      const data = await responses.text();
      if (data === "true") {
        try {
          const loginRequest={
            username: response.data.name,
            password: response.data.sub
          }
          const responsea = await fetch(
            "http://localhost:8080/tai-khoan/dang-nhap",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginRequest),
            }
          );
          
          if (responsea.ok) {
            const data = await responsea.json();
            // Lưu JWT vào localStorage
            localStorage.setItem("jwt", data.jwt);
            toast.success("Đăng nhập thành công!");
            if (localStorage.getItem("nextPay") === "true") {
              localStorage.removeItem("nextPay");
              navigate("/thanh-toan");
            } else {
              navigate("/");
            }
    
            window.location.reload();
          } else {
            toast.error(`Email này đã đăng ký tài khoản vui lòng đăng nhập tài khoản`);
            throw new Error("Đăng nhập thất bại!");
          }
        } catch (error) {
          console.error("Đăng nhập thất bại: ", error);
          setError(
            "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu."
          );
        }
        
        return true;
      }
      try {
      const urls = "http://localhost:8080/tai-khoan/dang-ky";

      const register = await fetch(urls, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          tenDangNhap: response.data.name,
          email: response.data.email,
          matKhau: response.data.sub,
          hoDem: response.data.family_name,
          ten: response.data.name,
          daKichHoat: 1,
        }),
      });
      if (response.ok) {
        try {
          const loginRequest={
            username: response.data.name,
            password: response.data.sub
          }
          const responsea = await fetch(
            "http://localhost:8080/tai-khoan/dang-nhap",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(loginRequest),
            }
          );
          
          if (responsea.ok) {
            const data = await responsea.json();
            // Lưu JWT vào localStorage
            localStorage.setItem("jwt", data.jwt);
            toast.success("Đăng nhập thành công!");
            if (localStorage.getItem("nextPay") === "true") {
              localStorage.removeItem("nextPay");
              navigate("/thanh-toan");
            } else {
              navigate("/");
            }
    
            window.location.reload();
          } else {
            toast.error(`Email này đã đăng ký tài khoản vui lòng đăng nhập tài khoản`);
            throw new Error("Đăng nhập thất bại!");
          }
        } catch (error) {
          setError(
            "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu."
          );
        }
      } else {
        toast.error("Đã xảy ra lỗi trong quá trình đăng nhập.");
      }
      } catch (error) {
        toast.error("Đã xảy ra lỗi trong quá trình đăng nhập.");
      }
      return false;
    } catch (error) {
      console.error("Lỗi khi kiểm tra tên Email: ", error);
      return false;
    }
  };
  const handleGoogleLoginError = (error: any) => {
    console.error("Google Login Error:", error);
    setError("Đăng nhập Google thất bại. Vui lòng thử lại.");
  };
  const handleDangNhap = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const loginRequest = {
      username: username,
      password: password,
    };


   


    try {
      const response = await fetch(
        "http://localhost:8080/tai-khoan/dang-nhap",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(loginRequest),
        }
      );

      if (response.ok) {
        const data = await response.json();
        // Lưu JWT vào localStorage
        localStorage.setItem("jwt", data.jwt);
        setError("Đăng nhập thành công!");
        if (localStorage.getItem("nextPay") === "true") {
          localStorage.removeItem("nextPay");
          navigate("/thanh-toan");
        } else {
          navigate("/"); // Chuyển hướng về trang chủ
        }

        window.location.reload(); // Reload để cập nhật state
      } else {
        throw new Error("Đăng nhập thất bại!");
      }
    } catch (error) {
      console.error("Đăng nhập thất bại: ", error);
      setError(
        "Đăng nhập thất bại. Vui lòng kiểm tra lại tên đăng nhập và mật khẩu."
      );
    }
  };

  return (
    <div className="container-fluid vh-100 overflow-hidden">
      <div className="row justify-content-center align-items-center h-100">
        <div className="col-md-6 col-lg-4">
          <div className="card shadow-lg">
            <div className="card-body p-5">
              <div className="text-center mb-4">
                <i className="fas fa-user-circle fa-3x text-primary mb-3"></i>
                <h3 className="font-weight-bold">Đăng nhập</h3>
              </div>

              <form onSubmit={handleDangNhap}>
                <div className="mb-3">
                  <label htmlFor="username" className="form-label">
                    Tên đăng nhập
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-user"></i>
                    </span>
                    <input
                      type="username"
                      className="form-control"
                      id="username"
                      placeholder="Nhập tên đăng nhập"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Mật khẩu
                  </label>
                  <div className="input-group">
                    <span className="input-group-text">
                      <i className="fas fa-lock"></i>
                    </span>
                    <input
                      type="password"
                      className="form-control"
                      id="password"
                      placeholder="Nhập mật khẩu"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div className="d-grid mb-4">
                  <LoginSocialGoogle
                    client_id="298075271230-0impui1kcgh74pjkfe2ar42ohbu9luip.apps.googleusercontent.com" // Thay bằng Google Client ID
                    scope="openid profile email" 
                    onResolve={handleGoogleLoginSuccess}
                    onReject={handleGoogleLoginError}
                  >
                    <GoogleLoginButton />
                  </LoginSocialGoogle>
                </div>
                <div className="mb-3 form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="remember"
                  />
                  <label className="form-check-label" htmlFor="remember">
                    Ghi nhớ đăng nhập
                  </label>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg">
                    Đăng nhập
                  </button>
                </div>

                {error && (
                  <div className="alert alert-danger mt-3" role="alert">
                    <i className="fas fa-exclamation-circle me-2"></i>
                    {error}
                  </div>
                )}

                <div className="text-center mt-3">
                  <button
                    className="btn btn-link text-decoration-none p-0"
                    onClick={() => {
                      /* xử lý quên mật khẩu */
                    }}
                  >
                    Quên mật khẩu?
                  </button>
                  <div className="mt-2">
                    Chưa có tài khoản?{" "}
                    <NavLink to="/dang-ky" className="text-decoration-none">
                      Đăng ký ngay
                    </NavLink>
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default DangNhap;

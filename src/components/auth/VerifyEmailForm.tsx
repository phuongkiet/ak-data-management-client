import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import { ChevronLeftIcon } from "../../icons/index.ts";
import Button from "../ui/button/Button.tsx";
import { useStore } from "../../app/stores/store.ts";
import { toast } from "react-toastify";
import Input from "../form/product-form/input/product/ProductInputField.tsx";
import ProductLabel from "../form/product-form/ProductLabel.tsx";

function VerifyEmailForm() {
  const [otp, setOtp] = useState("");
  const [email, setEmail] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const { userStore } = useStore();
  const navigate = useNavigate();

  useEffect(() => {
    let timer: number;
    if (countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [countdown]);

  const handleVerifyOTP = async () => {
    if (!otp) {
      toast.error("Vui lòng nhập mã OTP");
      return;
    }

    try {
      setIsVerifying(true);
      const result = await userStore.verifyEmail({ otpCode: otp });
      if (result) {
        toast.success("Xác thực email thành công!");
        navigate("/signin");
      }
    } catch (err: any) {
      if (err.response?.data?.errors?.OtpCode) {
        toast.error(err.response.data.errors.OtpCode[0]);
      } else {
        toast.error("Đã xảy ra lỗi hệ thống");
      }
      console.error(err);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Vui lòng nhập email");
      return;
    }

    try {
      setIsResending(true);
      await userStore.resendEmailConfirm({ email: email });
      toast.success("Đã gửi lại mã OTP");
      setCountdown(60); // Bắt đầu đếm ngược 60 giây
    } catch (err: any) {
      if (err.response?.data?.errors?.Email) {
        toast.error(err.response.data.errors.Email[0]);
      } else {
        toast.error("Không thể gửi lại mã OTP");
      }
      console.error(err);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col flex-1">
      <div className="w-full max-w-md pt-10 mx-auto">
        <Link
          to="/"
          className="inline-flex items-center text-sm text-gray-500 transition-colors hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
        >
          <ChevronLeftIcon className="size-5" />
          Trở về
        </Link>
      </div>
      <div className="flex flex-col justify-center flex-1 w-full max-w-md mx-auto">
        <div>
          <div className="mb-5 sm:mb-8">
            <h1 className="mb-2 font-semibold text-gray-800 text-title-sm dark:text-white/90 sm:text-title-md">
              Xác thực email
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Vui lòng nhập mã OTP đã được gửi đến email của bạn
            </p>
          </div>
          <div className="space-y-6">
            <div>
              <ProductLabel>
                Mã OTP <span className="text-error-500">*</span>
              </ProductLabel>
              <Input
                id="otp"
                name="otp"
                placeholder="Nhập mã OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />
            </div>
            <div>
              <Button
                onClick={handleVerifyOTP}
                disabled={isVerifying}
                className="w-full"
                size="sm"
              >
                {isVerifying ? "Đang xác thực..." : "Xác nhận"}
              </Button>
            </div>
            <div className="text-center border-t border-gray-200 pt-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 italic font-bold">
                Nếu bạn chưa nhận được mã OTP, vui lòng nhập email và gửi lại
              </p>
            </div>
            <div className="space-y-4">
              <div>
                <ProductLabel>
                  Email{" "}
                  <span className="text-error-500">*</span>
                </ProductLabel>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="Nhập email của bạn"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="text-center">
                <Button
                  onClick={handleResendOTP}
                  disabled={isResending || countdown > 0}
                  variant="outline"
                  size="sm"
                >
                  {isResending
                    ? "Đang gửi..."
                    : countdown > 0
                    ? `Gửi lại sau ${countdown}s`
                    : "Gửi lại mã OTP"}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(VerifyEmailForm);

import VerifyEmailForm from "../../components/auth/VerifyEmailForm";
import PageMeta from "../../components/common/PageMeta";
import AuthLayout from "./AuthPageLayout";

export default function VerifyEmail() {
  return (
    <>
      <PageMeta
        title="An Khánh Data Management"
        description="Đây là trang đăng nhập của website quản trị dữ liệu sản phẩn An Khánh"
      />
      <AuthLayout>
        <VerifyEmailForm />
      </AuthLayout>
    </>
  );
}
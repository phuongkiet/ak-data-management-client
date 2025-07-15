import PageBreadcrumb from "../components/common/PageBreadCrumb";
import UserMetaCard from "../components/UserProfile/UserMetaCard";
import UserInfoCard from "../components/UserProfile/UserInfoCard";
import PageMeta from "../components/common/PageMeta";
import UserAuthenticationCard from "../components/UserProfile/UserAuthenticationCard";
import Modal from "../components/ui/modal";
import { useState } from "react";
import ProductLabel from "../components/form/product-form/ProductLabel";
import Input from "../components/form/input/InputField";
import Button from "../components/ui/button/Button";
import { useStore } from "../app/stores/store";

export default function UserProfiles() {
  const { userStore } = useStore();
  const { loading } = userStore;

  const [isOpenChangePassword, setIsOpenChangePassword] = useState(false);

  const handleChangePassword = () => {
    setIsOpenChangePassword(true);
  };

  return (
    <>
      <PageMeta title="Trang cá nhân" description="Trang cá nhân" />
      <PageBreadcrumb pageTitle="Trang cá nhân" />
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-white/[0.03] lg:p-6">
        <h3 className="mb-5 text-lg font-semibold text-gray-800 dark:text-white/90 lg:mb-7">
          Trang cá nhân
        </h3>
        <div className="space-y-6">
          <UserMetaCard />
          <UserInfoCard />
          <UserAuthenticationCard handleChangePassword={handleChangePassword} />
        </div>
        <Modal
          isOpen={isOpenChangePassword}
          onClose={() => setIsOpenChangePassword(false)}
          className="w-full max-w-2xl"
        >
          <div className="p-5 rounded-2xl">
            <h1 className="text-2xl font-bold">Thay đổi mật khẩu</h1>
            <div className="grid grid-cols-1 gap-4 mt-5">
              <div>
                <ProductLabel>Mật khẩu cũ</ProductLabel>
                <Input type="password" placeholder="Nhập mật khẩu cũ" />
              </div>
              <div>
                <ProductLabel>Mật khẩu mới</ProductLabel>
                <Input type="password" placeholder="Nhập mật khẩu mới" />
              </div>
              <div>
                <ProductLabel>Xác nhận mật khẩu mới</ProductLabel>
                <Input type="password" placeholder="Nhập lại mật khẩu mới" />
              </div>
            </div>
            <div className="flex justify-end mt-5 gap-2">
            <Button
                    type="button"
                    onClick={handleChangePassword}
                    disabled={loading}
                    className="inline-flex items-center justify-center rounded-lg bg-[#334355] px-6 py-2.5 text-center text-sm font-bold text-white hover:bg-[#334355] focus:outline-none focus:ring-2 focus:ring-[#334355]/50 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      "Thay đổi mật khẩu"
                    )}
                  </Button>
              <Button variant="outline" onClick={() => setIsOpenChangePassword(false)}>Hủy</Button>
            </div>
          </div>
        </Modal>
      </div>
    </>
  );
}

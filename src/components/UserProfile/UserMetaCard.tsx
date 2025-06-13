import { useModal } from "../../hooks/useModal";
import Modal from "../ui/modal";
import Button from "../ui/button/Button";
import Input from "../form/product-form/input/product/ProductInputField.tsx";
import ProductLabel from "../form/product-form/ProductLabel.tsx";
import { useStore } from "../../app/stores/store";
import { formatDateLocal, convertRoleToVietnamese } from "../../app/common/common.ts";
import { observer } from "mobx-react-lite";
import ProductDatePicker from "../form/product-form/product-date-picker.tsx";
import ProductDropZone from "../form/product-form/form-elements/product/ProductDropZone";
import { useState } from "react";
import { User } from "../../app/models/user/user.model";

const UserMetaCard = () => {
  const { userStore } = useStore();
  const { user } = userStore;
  const { isOpen, openModal, closeModal } = useModal();
  const [avatarModalOpen, setAvatarModalOpen] = useState(false);
  const [editUser, setEditUser] = useState<User | undefined>(user);
  const handleSave = async () => {
    if (editUser) {
      const result = await userStore.updateUser(editUser.email, {
        birthday: editUser.birthday,
        name: editUser.name,
        userName: editUser.username,
        phoneNumber: editUser.phoneNumber,
        roleId: editUser.roleId,
      });
      if (result) {
        closeModal();
      }
    }
  };

  const handleAvatarUpload = async (files: File[]) => {
    if (files && files[0] && user) {
      await userStore.updateAvatar(user.email, files[0]);
      setAvatarModalOpen(false);
    }
  };

  return (
    <>
      <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-col items-center w-full gap-6 xl:flex-row">
            <div className="relative group w-20 h-20 overflow-hidden border border-gray-200 rounded-full dark:border-gray-800">
              <img
                src={user?.avatarUrl || "/images/user/avatar_hieuseo.jpg"}
                alt="user"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => setAvatarModalOpen(true)}
                tabIndex={-1}
              >
                <svg
                  className="w-7 h-7 text-white"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path d="M15.232 5.232l3.536 3.536M9 13l6-6 3 3-6 6H9v-3z" />
                </svg>
              </button>
            </div>
            <div className="order-3 xl:order-2">
              <h4 className="mb-2 text-lg font-semibold text-center text-gray-800 dark:text-white/90 xl:text-left">
                {user?.name}
              </h4>
              <div className="flex flex-col items-center gap-1 text-center xl:flex-row xl:gap-3 xl:text-left">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {(Array.isArray(user?.role) ? user?.role : user?.role ? [user.role] : []).map(convertRoleToVietnamese).join(" ")}
                </p>
                <div className="hidden h-3.5 w-px bg-gray-300 dark:bg-gray-700 xl:block"></div>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Hồ Chí Minh ,Việt Nam
                </p>
              </div>
            </div>
          </div>
          <button
            onClick={openModal}
            className="flex w-full items-center justify-center gap-1 rounded-full border border-gray-300 bg-white px-4 py-3 text-sm font-medium text-gray-700 shadow-theme-xs hover:bg-gray-50 hover:text-gray-800 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-white/[0.03] dark:hover:text-gray-200 lg:inline-flex lg:w-lg"
          >
            <svg
              className="fill-current"
              width="18"
              height="18"
              viewBox="0 0 18 18"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M15.0911 2.78206C14.2125 1.90338 12.7878 1.90338 11.9092 2.78206L4.57524 10.116C4.26682 10.4244 4.0547 10.8158 3.96468 11.2426L3.31231 14.3352C3.25997 14.5833 3.33653 14.841 3.51583 15.0203C3.69512 15.1996 3.95286 15.2761 4.20096 15.2238L7.29355 14.5714C7.72031 14.4814 8.11172 14.2693 8.42013 13.9609L15.7541 6.62695C16.6327 5.74827 16.6327 4.32365 15.7541 3.44497L15.0911 2.78206ZM12.9698 3.84272C13.2627 3.54982 13.7376 3.54982 14.0305 3.84272L14.6934 4.50563C14.9863 4.79852 14.9863 5.2734 14.6934 5.56629L14.044 6.21573L12.3204 4.49215L12.9698 3.84272ZM11.2597 5.55281L5.6359 11.1766C5.53309 11.2794 5.46238 11.4099 5.43238 11.5522L5.01758 13.5185L6.98394 13.1037C7.1262 13.0737 7.25666 13.003 7.35947 12.9002L12.9833 7.27639L11.2597 5.55281Z"
                fill=""
              />
            </svg>
            Chỉnh sửa
          </button>
        </div>
      </div>
      <Modal isOpen={isOpen} onClose={closeModal} className="max-w-[700px] m-4">
        <div className="w-full max-w-[700px] rounded-3xl bg-white p-4 dark:bg-gray-900 lg:p-11">
          <div className="px-2 pr-14">
            <h4 className="mb-2 text-2xl font-semibold text-gray-800 dark:text-white/90">
              Chỉnh sửa thông tin cá nhân
            </h4>
            <p className="mb-6 text-sm text-gray-500 dark:text-gray-400 lg:mb-7">
              Cập nhật thông tin cá nhân của bạn để giữ cho trang cá nhân của
              bạn cập nhật.
            </p>
          </div>
          <div>
            <h5 className="mb-5 text-lg font-medium text-gray-800 dark:text-white/90 lg:mb-6">
              Thông tin cá nhân
            </h5>
            <div className="grid grid-cols-1 gap-x-6 gap-y-5 lg:grid-cols-2">
              <div className="col-span-2 lg:col-span-1">
                <ProductLabel>Họ tên</ProductLabel>
                <Input 
                  type="text" 
                  value={editUser?.name} 
                  onChange={(e) => setEditUser(editUser ? {...editUser, name: e.target.value} : undefined)}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <ProductLabel>Số điện thoại</ProductLabel>
                <Input 
                  type="text" 
                  value={editUser?.phoneNumber} 
                  onChange={(e) => setEditUser(editUser ? {...editUser, phoneNumber: e.target.value} : undefined)}
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <ProductLabel>Email</ProductLabel>
                <Input 
                  type="text" 
                  value={editUser?.email} 
                  disabled 
                  className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                />
              </div>

              <div className="col-span-2 lg:col-span-1">
                <ProductLabel>Ngày sinh</ProductLabel>
                <ProductDatePicker
                  id="birthday"
                  defaultDate={editUser?.birthday}
                  onChange={(dates) =>
                    setEditUser(editUser ? {
                      ...editUser,
                      birthday: dates && dates[0] ? formatDateLocal(dates[0]) : "",
                    } : undefined)
                  }
                />
              </div>

              <div className="col-span-2">
                <ProductLabel>Vai trò</ProductLabel>
                <Input 
                  type="text" 
                  value={(Array.isArray(editUser?.role) ? editUser?.role : editUser?.role ? [editUser.role] : []).map(convertRoleToVietnamese).join(" ")} 
                  disabled 
                  className="bg-gray-100 dark:bg-gray-800 cursor-not-allowed"
                />
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3 px-2 mt-4 lg:justify-end">
            <Button
              size="sm"
              className="bg-[#334357] text-white font-semibold"
              onClick={closeModal}
              disabled={userStore.loading}
            >
              Đóng
            </Button>
            <Button
              size="sm"
              className="bg-[#334357] text-white font-semibold"
              onClick={handleSave}
              disabled={userStore.loading}
            >
              {userStore.loading ? (
                <div className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Đang xử lý...</span>
                </div>
              ) : (
                "Lưu thay đổi"
              )}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal upload avatar */}
      {avatarModalOpen && (
        <Modal
          isOpen={avatarModalOpen}
          onClose={() => setAvatarModalOpen(false)}
          showCloseButton={false}
          className="max-w-xl m-4"
        >
          <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full">
            <ProductDropZone onDrop={handleAvatarUpload} isLoading={userStore.loading} />
          </div>
        </Modal>
      )}
    </>
  );
};
export default observer(UserMetaCard);

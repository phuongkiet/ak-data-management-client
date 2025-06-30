import { useStore } from "../../app/stores/store.ts";
import { observer } from "mobx-react-lite";
import { useState, useEffect } from "react";
import Input from "../form/input/InputField.tsx";
import TagInput from "../form/input/TagInput.tsx";
import ProductLabel from "../form/product-form/ProductLabel.tsx";
import Button from "../ui/button/Button.tsx";

const SettingCard = () => {
  const { settingStore } = useStore();
  const { setting, updateSetting, loading } = settingStore;
  
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    emailToSend: "",
    emailToCC: [] as string[]
  });

  useEffect(() => {
    if (setting) {
      setFormData({
        emailToSend: setting.emailToSend || "",
        emailToCC: setting.emailToCC || []
      });
    }
  }, [setting]);

  const handleInputChange = (field: string, value: string | string[]) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = async () => {
    try {
      await updateSetting(formData);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save settings:", error);
    }
  };

  const handleCancel = () => {
    if (setting) {
      setFormData({
        emailToSend: setting.emailToSend || "",
        emailToCC: setting.emailToCC || []
      });
    }
    setIsEditing(false);
  };

  return (
    <div className="p-5 border border-gray-200 rounded-2xl dark:border-gray-800 lg:p-6">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
        <div className="w-full">
          <div className="flex items-center justify-between mb-6">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Cài đặt
            </h4>
            {!isEditing ? (
              <Button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 text-sm font-semibold text-white bg-[#334355] rounded-lg hover:bg-[#334355]/80 focus:outline-none focus:ring-2 focus:ring-[#334355]/20"
              >
                Chỉnh sửa
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  onClick={handleSave}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-white bg-success-500 rounded-lg hover:bg-success-600 focus:outline-none focus:ring-2 focus:ring-success-500/20 disabled:opacity-50"
                >
                  {loading ? "Đang lưu..." : "Lưu"}
                </Button>
                <Button
                  onClick={handleCancel}
                  disabled={loading}
                  className="px-4 py-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500/20 dark:text-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 disabled:opacity-50"
                >
                  Hủy
                </Button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-7 2xl:gap-x-32">
            <div>
              <ProductLabel htmlFor="emailToSend">Email nhận</ProductLabel>
              {isEditing ? (
                <Input
                  type="email"
                  value={formData.emailToSend}
                  onChange={(e) => handleInputChange("emailToSend", e.target.value)}
                  placeholder="Nhập email gửi"
                />
              ) : (
                <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                  {setting?.emailToSend || "Chưa có dữ liệu"}
                </p>
              )}
            </div>

            <div>
              <ProductLabel htmlFor="emailToCC">Email nhận CC</ProductLabel>
              {isEditing ? (
                <TagInput
                  value={formData.emailToCC}
                  onChange={(tags) => handleInputChange("emailToCC", tags)}
                  placeholder="Nhập email và nhấn Enter"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {setting?.emailToCC && setting.emailToCC.length > 0 ? (
                    setting.emailToCC.map((email, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 text-xs font-medium bg-brand-100 text-brand-800 rounded-md dark:bg-brand-900 dark:text-brand-200"
                      >
                        {email}
                      </span>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Chưa có email CC
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default observer(SettingCard);
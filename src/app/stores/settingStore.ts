import { makeAutoObservable, runInAction } from "mobx";
// import agent from '../api/agent.ts'
// import { toast } from 'react-toastify'
// import { AddSizeDto, ProductSizeDto } from '../models/product/productSize.model.ts'
import { SettingDto, UpdateSettingDto } from "../models/setting.model.ts";
import { toast } from "react-toastify";
import agent from "../api/agent.ts";

export default class SettingStore {
  setting: SettingDto | null = null;
  loading = false;
  term: string = "";

  settingForm: UpdateSettingDto = {
    emailToSend: "",
    emailToCC: [],
    googleDriveFileId: "",
    googleDriveStorageLinkId: ""
  };

  constructor() {
    makeAutoObservable(this);
  }

  setSetting = (setting: SettingDto | null) => {
    this.setting = setting;
  };

  setTerm = (term: string) => {
    this.term = term;
    this.loadSettings(this.term);
  };

  loadSettings = async (term?: string) => {
    this.loading = true;
    try {
      const result = await agent.Setting.settingList(term);
      runInAction(() => {
        // Take the first setting from the list or null if empty
        this.setting = result.data && result.data.length > 0 ? result.data[0] : null;
        this.loading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load setting", error);
      toast.error("Lỗi khi tải dữ liệu cài đặt.");
    }
  };

  updateSetting = async (setting: UpdateSettingDto) => {
    this.loading = true;
    try {
      const result = await agent.Setting.updateSetting(Number(this.setting?.id) || 0, setting);
      runInAction(() => {
        this.loading = false;
      });
      
      if (result.success) {
        // Update local setting object with new data
        if (this.setting) {
          this.setting = {
            ...this.setting,
            emailToSend: setting.emailToSend,
            emailToCC: setting.emailToCC,
            googleDriveFileId: setting.googleDriveFileId,
            googleDriveStorageLinkId: setting.googleDriveStorageLinkId
          };
        }
        toast.success("Cập nhật cài đặt thành công.");
      } else {
        toast.error(result.errors?.join(", ") || "Lỗi khi cập nhật cài đặt.");
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to update setting", error);
      toast.error("Lỗi khi cập nhật cài đặt.");
    }
  };

  updateSettingForm = <K extends keyof UpdateSettingDto>(key: K, value: UpdateSettingDto[K]) => {
    this.settingForm[key] = value;
  };
}

import { action, makeObservable, observable, runInAction } from 'mobx'
import agent from '../api/agent.ts'
import { toast } from 'react-toastify'
import { LinkStorageDto } from '../models/storage/linkStorage.model.ts';
import { AddLinkStorageDto, UpdateLinkStorageDto } from '../models/storage/linkStorage.model.ts';
import BaseStore from './baseStore.ts'
// import { OfflineStorage } from '../services/offlineStorage.ts'

export default class LinkStorageStore extends BaseStore {
  linkStorageList: LinkStorageDto[] = [];
  linkStorageRegistry = new Map<string, LinkStorageDto>();
  loading = false;
  term: string = '';

  linkStorageForm: AddLinkStorageDto = {
    name: '',
    url: '',
  };

  linkStorageFormUpdate: UpdateLinkStorageDto = {
    name: '',
    url: '',
  };

  constructor() {
    super();
    makeObservable(this, {
      linkStorageList: observable,
      linkStorageRegistry: observable,
      loading: observable,
      term: observable,
      linkStorageForm: observable,
      linkStorageFormUpdate: observable,
      setLinkStorageList: action,
      setTerm: action,
      loadLinkStorages: action, 
      updateLinkStorageForm: action,
      updateLinkStorage: action,
      updateLinkStorageFormUpdate: action,
      resetLinkStorageForm: action,
    });
  }

  setLinkStorageList = (list: LinkStorageDto[]) => {
    this.linkStorageList = list;
    this.linkStorageRegistry.clear();
    list.forEach((linkStorage) => {
      if (linkStorage.name != null)
        this.linkStorageRegistry.set(linkStorage.name, linkStorage);
    });
    // Update metadata in localStorage
    // const currentMetadata = OfflineStorage.getMetadata();
    // if (currentMetadata) {
    //   currentMetadata.linkStorageDtos = list.map(linkStorage => ({
    //     name: linkStorage.name,
    //     url: linkStorage.url,
    //   }));
    //   OfflineStorage.saveMetadata(currentMetadata);
    // }
  }

  setTerm = (term: string) => {
    this.term = term;
    this.loadLinkStorages();
  }

  loadLinkStorages = async () => {
    this.loading = true;
    try {
      // Kiểm tra localStorage trước
      const cached = localStorage.getItem("linkStorageList");
      if (cached) {
        const data = JSON.parse(cached);
        runInAction(() => {
          this.linkStorageList = data;
          this.loading = false;
          this.linkStorageRegistry.clear();
          data.forEach((linkStorage: any) => {
            if (linkStorage.name != null) this.linkStorageRegistry.set(linkStorage.name, linkStorage);
          });
        });
        return;
      }

      // Nếu chưa có, gọi API
      const result = await agent.LinkStorage.linkStorageList();
      runInAction(() => {
        this.linkStorageList = result.data || [];
        this.loading = false;
        this.linkStorageRegistry.clear();
        this.linkStorageList.forEach(linkStorage => {
          if (linkStorage.name != null) this.linkStorageRegistry.set(linkStorage.name, linkStorage);
        });
        // Lưu vào localStorage
        localStorage.setItem("linkStorageList", JSON.stringify(this.linkStorageList));
      });
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to load link storage", error);
      toast.error("Lỗi khi tải dữ liệu kho.")
    }
  };

  updateLinkStorageForm = <K extends keyof AddLinkStorageDto>(field: K, value: AddLinkStorageDto[K]) => {
    runInAction(() => {
      this.linkStorageForm[field] = value;
    });
  };

  resetLinkStorageForm = () => {
    runInAction(() => {
      this.linkStorageForm = {
        name: '',
        url: '',
      };
    });
  };

  addLinkStorage = async () => {
    this.loading = true;
    try {
      const result = await agent.LinkStorage.addLinkStorage(this.linkStorageForm);
      if (result.success) {
        toast.success("Nhà máy đã được tạo thành công.");
        // Thêm mới vào list hiện tại
        const newItem = { id: Number(result.data), ...this.linkStorageForm };
        this.linkStorageList = [...this.linkStorageList, newItem];
        // Cập nhật localStorage
        localStorage.setItem("linkStorageList", JSON.stringify(this.linkStorageList));
        this.loading = false;
        this.linkStorageForm.name = '';
        this.linkStorageForm.url = '';
        return true;
      }
      return false;
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add link storage", error);
      toast.error("Lỗi khi tạo kho.")
    }
  }

  updateLinkStorage = async (linkId: number) => {
    this.loading = true;
    try {
      const result = await agent.LinkStorage.updateLinkStorage(linkId, this.linkStorageFormUpdate);
      if (result.success) {
        toast.success("Cập nhật kho thành công.");
        // Cập nhật lại item trong list
        this.linkStorageList = this.linkStorageList.map(item =>
          item.id === linkId
            ? { ...item, ...this.linkStorageFormUpdate }
            : item
        );
        // Cập nhật localStorage
        localStorage.setItem("linkStorageList", JSON.stringify(this.linkStorageList));
        this.resetLinkStorageForm();
        this.loading = false;
        return true;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  updateLinkStorageFormUpdate = <K extends keyof UpdateLinkStorageDto>(field: K, value: UpdateLinkStorageDto[K]) => {
    runInAction(() => {
      this.linkStorageFormUpdate = {
        ...this.linkStorageFormUpdate,
        [field]: value
      };
    });
  }
}
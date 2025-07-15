import {
  AddUserDto,
  User,
  UserDto,
  UserLoginFormValues,
  UserUpdateDto,
} from "../models/user/user.model.ts";
import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent.ts";
import { store } from "./store.ts";
import { router } from "../router/route.tsx";
import { toast } from "react-toastify";
import {
  ForgotPasswordModel,
  HardResetPasswordModel,
  ResendEmailConfirmModel,
  VerifyEmailModel,
} from "../models/auth/authentication.model.ts";

export default class UserStore {
  user: User | undefined = undefined;
  userList: UserDto[] = [];
  userRegistry = new Map<number, UserDto>();
  loading = false;
  term: string | null = null;

  userForm: AddUserDto = {
    birthday: null,
    fullName: "",
    userName: "",
    phoneNumber: "",
    email: "",
    roleId: 0,
  };

  constructor() {
    makeAutoObservable(this);
  }

  login = async (
    creds: UserLoginFormValues
  ): Promise<{ success: boolean; errors?: string[] }> => {
    try {
      const user = await agent.Account.login(creds);
      runInAction(() => {
        this.user = user.data;
        if (this.user) {
          store.commonStore.setToken(this.user.token);
        }
        router.navigate("/");
      });
      return { success: true };
    } catch (error: any) {
      const err = error.response?.data?.errors || ["Đăng nhập thất bại"];
      return { success: false, errors: err };
    }
  };

  logout = () => {
    store.commonStore.setToken(null);
    this.user = undefined;
    setTimeout(() => {
      router.navigate("/signin");
    }, 100);
  };

  getUser = async () => {
    try {
      const user = await agent.Account.current();
      if (user.data) {
        store.commonStore.setToken(user.data.token);
      }
      runInAction(() => {
        this.user = user.data;
      });
    } catch (error) {
      console.error("getUser error", error);
    }
  };

  setTerm = (term: string) => {
    this.term = term;
  };

  searchUser = async () => {
    await this.listAllUser(this.term ?? undefined);
  };

  listAllUser = async (term?: string) => {
    this.loading = true;
    try {
      const users = await agent.UserAdmin.adminList(term ?? undefined);
      if (users.data) {
        runInAction(() => {
          this.userList = users.data || [];
          this.loading = false;

          this.userList.forEach((user) => {
            this.userRegistry.set(user.id, user);
          });
        });
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      toast.error("Lỗi khi tải danh sách người dùng");
    }
  };

  forgotPassword = async (dto: ForgotPasswordModel) => {
    this.loading = true;
    try {
      const result = await agent.Account.forgotPassword(dto);
      if (result.success) {
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("forgotPassword error", error);
      this.loading = false;
      return false;
    }
  };

  resetPassword = async (values: any) => {
    this.loading = true;
    try {
      const result = await agent.Account.resetPassword(values);
      if (result.success) {
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("resetPassword error", error);
      this.loading = false;
      return false;
    }
  };

  verifyEmail = async (dto: VerifyEmailModel) => {
    this.loading = true;
    try {
      const result = await agent.Account.verifyEmail(dto);
      if (result.success) {
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("verifyEmail error", error);
      this.loading = false;
      return false;
    }
  };

  resendEmailConfirm = async (dto: ResendEmailConfirmModel) => {
    try {
      await agent.Account.resendEmailConfirm(dto);
    } catch (error) {
      console.error("resendEmailConfirm error", error);
    }
  };

  addUser = async (dto: AddUserDto) => {
    this.loading = true;
    try {
      const result = await agent.UserAdmin.addUser(dto);
      if (result.success) {
        toast.success("Thêm người dùng thành công");
        this.loading = false;
        this.listAllUser();
        return true;
      } else {
        toast.error("Lỗi khi thêm người dùng");
        this.loading = false;
        return false;
      }
    } catch (error) {
      runInAction(() => {
        this.loading = false;
      });
      console.error("Failed to add user", error);
      toast.error("Lỗi khi thêm người dùng");
      return false;
    }
  };

  banUser = async (userEmail: string) => {
    try {
      const result = await agent.UserAdmin.banUser(userEmail);
      if (result.success) {
        toast.success(result.data);
        this.listAllUser();
      }
    } catch (error) {
      console.error("banUser error", error);
      toast.error("Lỗi khi khóa người dùng");
    }
  };

  unBanUser = async (userEmail: string) => {
    try {
      const result = await agent.UserAdmin.unBanUser(userEmail);
      if (result.success) {
        toast.success(result.data);
        this.listAllUser();
      }
    } catch (error) {
      console.error("unBanUser error", error);
      toast.error("Lỗi khi mở khóa người dùng");
    }
  };

  updateUser = async (userEmail: string, dto: UserUpdateDto) => {
    this.loading = true;
    try {
      const result = await agent.UserAdmin.updateUser(userEmail, dto);
      if (result.success) {
        toast.success(result.data || "Cập nhật người dùng thành công");
        this.loading = false;
        this.listAllUser();
        await this.getUser();
        return true;
      } else {
        toast.error(result.errors || "Lỗi khi cập nhật người dùng");
        this.loading = false;
        return false;
      }
    } catch (error) {
      console.error("updateUser error", error);
      toast.error("Lỗi khi cập nhật người dùng");
      this.loading = false;
      return false;
    }
  };

  updateAvatar = async (userEmail: string, image: File) => {
    this.loading = true;
    try {
      const result = await agent.Account.updateAvatar({
        userEmail: userEmail,
        file: image,
      });
      if (result.success) {
        toast.success(result.data || "Cập nhật ảnh đại diện thành công");
        this.loading = false;
        await this.getUser();
        return true;
      } else {
        toast.error(result.errors || "Lỗi khi cập nhật ảnh đại diện");
        this.loading = false;
        return false;
      }
    } catch (error) {
      console.error("updateAvatar error", error);
      toast.error("Lỗi khi cập nhật ảnh đại diện");
      this.loading = false;
      return false;
    }
  };

  hardResetPassword = async (dto: HardResetPasswordModel) => {
    this.loading = true;
    try {
      const result = await agent.Account.hardResetPassword(dto);
      if (result.success) {
        toast.success(result.data || "Đổi mật khẩu thành công");
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("hardResetPassword error", error);
      toast.error("Lỗi khi đổi mật khẩu");
      this.loading = false;
      return false;
    }
  };
}

import {AddUserDto, User, UserDto, UserLoginFormValues} from "../models/user/user.model.ts";
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent.ts";
import {store} from "./store.ts";
import { router } from "../router/route.tsx";
import { toast } from "react-toastify";
import { ForgotPasswordModel, ResendEmailConfirmModel, VerifyEmailModel } from "../models/auth/authentication.model.ts";

export default class UserStore {
  user: User | undefined = undefined;
  userList: UserDto[] = [];
  userRegistry = new Map<number, UserDto>();
  loading = false;
  term: string | null = null;

  userForm: AddUserDto = {
    birthday: null,
    password: '',
    userName: '',
    phoneNumber: '',
    email: '',
    roleId: 0,
  }

  constructor() {
    makeAutoObservable(this);
  }

  login = async (creds: UserLoginFormValues): Promise<{ success: boolean; errors?: string[] }> => {
    try {
      const user = await agent.Account.login(creds);
      runInAction(() => {
        this.user = user.data;
        if (this.user) {
          store.commonStore.setToken(this.user.token);
        }
        if (this.user?.role.includes("Admin")) {
          router.navigate("/");
        } else if (this.user?.role.includes("Strategist")) {
          router.navigate("/");
        }
      });
      return { success: true };
    } catch (error: any) {
      const err = error.response?.data?.errors || ['Đăng nhập thất bại'];
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
      console.log("API /auth trả về:", user);
      if (user.data) {
        store.commonStore.setToken(user.data.token);
      }
      runInAction(() => {
        this.user = user.data;
        console.log("userStore.user được set:", this.user);
      });
    } catch (error) {
      console.error("getUser error", error);
    }
  };

  setTerm = (term: string) => {
    this.term = term;
    this.listAllUser(this.term);
  }

  listAllUser = async (term?: string) => {
    this.loading = true;
    try{
      const users = await agent.UserAdmin.adminList(term ?? undefined);
      console.log("users", users);
      if(users.data){
        runInAction(() => {
          this.userList = users.data || [];
          this.loading = false;
          
          this.userList.forEach(user => {
            this.userRegistry.set(user.id, user);
          })
        })
      }
    }catch(error){
      runInAction(() => {
        this.loading = false;
      })
      console.log(error);
      toast.error("Lỗi khi tải danh sách người dùng");
    }
  }

  forgotPassword = async (dto: ForgotPasswordModel) => {
    this.loading = true;
    try {
      const result = await agent.Account.forgotPassword(dto);
      if(result.success) {
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("forgotPassword error", error);
      this.loading = false;
      return false;
    }
  }

  resetPassword = async (values: any) => {
    this.loading = true;
    try {
      const result = await agent.Account.resetPassword(values);
      if(result.success) {
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("resetPassword error", error);
      this.loading = false;
      return false;
    }
  }

  verifyEmail = async (dto: VerifyEmailModel) => {
    this.loading = true;
    try {
      const result = await agent.Account.verifyEmail(dto);
      if(result.success) {
        this.loading = false;
        return true;
      }
    } catch (error) {
      console.error("verifyEmail error", error);
      this.loading = false;
      return false;
    }
  }

  resendEmailConfirm = async (dto: ResendEmailConfirmModel) => {
    try {
      await agent.Account.resendEmailConfirm(dto);
    } catch (error) {
      console.error("resendEmailConfirm error", error); 
    }
  }
}
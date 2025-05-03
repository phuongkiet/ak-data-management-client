import {User, UserLoginFormValues} from "../models/user/user.model.ts";
import {makeAutoObservable, runInAction} from "mobx";
import agent from "../api/agent.ts";
import {store} from "./store.ts";
import { router } from "../router/route.tsx";

export default class UserStore {
  user: User | undefined = undefined;

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
    const user = await agent.Account.current();
    console.log(user);
    if (user.data) {
      store.commonStore.setToken(user.data.token);
    }
    runInAction(() => {
      this.user = user.data;
      console.log(this.user?.role)
      // if (this.user?.role.includes('Admin') && !location.pathname.includes('admin')) {
      //   router.navigate("/");
      // } else if (this.user?.role.includes('Client') && !location.pathname.includes('client')) {
      //   router.navigate("/");
      // }
    });
  };
}
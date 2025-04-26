import {makeAutoObservable, reaction} from "mobx";
import {ServerError} from "../models/common/ServerError.ts";

export default class CommonStore {
  error: ServerError | null = null;
  token: string | null = localStorage.getItem('jwt');
  appLoaded = false;
  onlineUsers: string[] = [];

  constructor() {
    makeAutoObservable(this);

    reaction(
      () => this.token,
      token => {
        if (token) {
          localStorage.setItem('jwt', token);
        } else {
          localStorage.removeItem('jwt');
        }
      }
    )
  }

  setOnlineUsers = (usernames: string[]) => {
    this.onlineUsers = usernames;
  }

  addOnlineUsers = (username: string) => {
    this.onlineUsers.push(username);
  }

  removeOnlineUsers = (username: string) => {
    this.onlineUsers = this.onlineUsers.filter(x => x !== username);
  }

  setServerError(error: ServerError) {
    this.error = error;
  }

  setToken = (token: string | null) => {
    this.token = token;
  }

  setAppLoaded = () => {
    this.appLoaded = true;
  }
}
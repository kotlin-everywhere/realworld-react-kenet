import { makeAutoObservable } from "mobx";
import { api } from "./api";

export class SiteModel {
  user: SiteUser | null = null;

  constructor() {
    makeAutoObservable(this);

    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken?.length) {
      return;
    }

    api.basicUserInfo({ accessToken }).then((res) => {
      if (res.data) {
        this.setUser({ ...res.data, accessToken });
      } else {
        this.setUser(null);
      }
    });
  }

  setUser(user: SiteUser | null) {
    this.user = user;

    if (user) {
      localStorage.setItem("accessToken", user.accessToken);
    } else {
      localStorage.removeItem("accessToken");
    }
  }
}

export interface SiteUser {
  accessToken: string;
  profilePictureUrl: string;
  name: string;
  note: string;
}

export const siteModel = new SiteModel();

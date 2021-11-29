import { makeAutoObservable } from "mobx";

export class SiteModel {
  user: SiteUser | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setUser(user: SiteUser) {
    this.user = user;
  }
}

interface SiteUser {
  accessToken: string;
  profilePictureUrl: string;
  name: string;
  note: string;
}

export const siteModel = new SiteModel();

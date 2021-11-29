import { Api } from "./api/api";

export const api = new Api("http://localhost:5000");

export const alertErrors = (errors: string[]) => {
  if (!errors.length) {
    return false;
  }
  alert(errors.join("\n"));
  return true;
};

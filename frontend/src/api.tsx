import { Api } from "./api/api";
import { API_HOST } from "./env";

export const api = new Api(API_HOST, true);

export const alertErrors = (errors: string[]) => {
  if (!errors.length) {
    return false;
  }
  alert(errors.join("\n"));
  return true;
};

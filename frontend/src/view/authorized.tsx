import { ReactElement, useEffect } from "react";
import { siteModel, SiteUser } from "../model";
import { observer } from "mobx-react-lite";
import { useHistory } from "react-router-dom";

export const authorized = (builder: (user: SiteUser) => ReactElement) => {
  return observer(() => {
    const history = useHistory();
    useEffect(() => {
      if (!siteModel.user) {
        history.push({ pathname: "/login" });
        return;
      }
    }, [history]);
    return siteModel.user ? builder(siteModel.user) : <></>;
  });
};

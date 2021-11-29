import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { siteModel, SiteUser } from "../model";
import { alertErrors, api } from "../api";

export const SettingPage = observer(() => {
  const history = useHistory();
  useEffect(() => {
    if (!siteModel.user) {
      history.push({ pathname: "/login" });
    }
  }, [history]);

  return (
    <div className="settings-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Your Settings</h1>
            {siteModel.user ? <Form user={siteModel.user} /> : <></>}
          </div>
        </div>
      </div>
    </div>
  );
});

const Form = (props: { user: SiteUser }) => {
  const [name, setName] = useState(props.user.name);
  const [profilePictureUrl, setProfilePictureUrl] = useState(
    props.user.profilePictureUrl
  );
  const [note, setNote] = useState(props.user.note);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onUpdateSetting = async () => {
    if (!name.length) {
      alert("Input a name");
      return;
    }

    if (password.length) {
      if (!email.length) {
        alert("Input your email to change password");
        return;
      }
    }

    const res = await api.updateProfile({
      accessToken: props.user.accessToken,
      name,
      profilePictureUrl,
      note,
      email,
      password,
    });
    if (alertErrors(res.errors)) {
      return;
    }
    alert("Updated");
  };

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onUpdateSetting();
      }}
    >
      <fieldset>
        <fieldset className="form-group">
          <input
            className="form-control"
            type="text"
            placeholder="URL of profile picture"
            value={profilePictureUrl}
            onChange={(e) => setProfilePictureUrl(e.target.value)}
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </fieldset>
        <fieldset className="form-group">
          <textarea
            className="form-control form-control-lg"
            rows={8}
            placeholder="Short bio about you"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </fieldset>
        <fieldset className="form-group">
          <input
            className="form-control form-control-lg"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </fieldset>
        <button className="btn btn-lg btn-primary pull-xs-right">
          Update Settings
        </button>
      </fieldset>
    </form>
  );
};

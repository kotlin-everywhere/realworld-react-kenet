import { Link, Router, useHistory } from "react-router-dom";
import { useState } from "react";
import _ from "lodash";
import { api } from "../api";

export const SignUpPage = () => {
  const history = useHistory();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const onSignUp = async () => {
    const errs = [];
    if (!name.length) {
      errs.push("Input a name");
    }
    if (!email.length) {
      errs.push("Input an email");
    }
    if (!password.length) {
      errs.push("Input a password");
    }
    if (!_.eq(password, passwordConfirm)) {
      errs.push("password and password confirm dose not matched");
    }
    setErrors(errs);
    if (errs.length) {
      return;
    }

    const res = await api.signUp({ email, name, password });
    if (res.errors.length) {
      setErrors(res.errors);
      return;
    }

    history.replace({ pathname: "/" });
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign up</h1>
            <p className="text-xs-center">
              <Link to="/login">Have an account?</Link>
            </p>

            {errors.map((error, index) => {
              return (
                <ul className="error-messages" key={index}>
                  <li>{error}</li>
                </ul>
              );
            })}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                onSignUp();
              }}
            >
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
              <fieldset className="form-group">
                <input
                  className="form-control form-control-lg"
                  type="password"
                  placeholder="Password confirm"
                  value={passwordConfirm}
                  onChange={(e) => setPasswordConfirm(e.target.value)}
                />
              </fieldset>
              <button className="btn btn-lg btn-primary pull-xs-right">
                Sign up
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

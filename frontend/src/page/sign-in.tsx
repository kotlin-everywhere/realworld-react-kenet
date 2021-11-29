import { ReactElement, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { api } from "../api";
import { siteModel } from "../model";

export function SignInPage(): ReactElement {
  const history = useHistory();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const onSignIn = async () => {
    const res = await api.signIn({ email, password });
    if (res.errors.length) {
      setErrors(res.errors);
      return;
    }
    if (!res.data) {
      return;
    }

    siteModel.setUser(res.data);
    history.replace({ pathname: "/" });
  };

  return (
    <div className="auth-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-6 offset-md-3 col-xs-12">
            <h1 className="text-xs-center">Sign in</h1>
            <p className="text-xs-center">
              <Link to="/register">Don't have an account yet? Sign Up</Link>
            </p>

            {errors.map((error, index) => {
              return (
                <ul className="error-messages" key={index}>
                  <li>{error}</li>
                </ul>
              );
            })}

            <form>
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
              <button
                className="btn btn-lg btn-primary pull-xs-right"
                onClick={onSignIn}
              >
                Sign in
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

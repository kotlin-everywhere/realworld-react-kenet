import { PropsWithChildren, ReactElement } from "react";
import { Link, useRouteMatch } from "react-router-dom";

export function Layout(props: PropsWithChildren<{}>): ReactElement {
  return (
    <div>
      <nav className="navbar navbar-light">
        <div className="container">
          <Link className="navbar-brand" to="/">
            conduit
          </Link>
          <ul className="nav navbar-nav pull-xs-right">
            <NavItem to="/" label="Home" />
            <NavItem to="/editor" label="New Article" icon="ion-compose" />
            <NavItem to="/settings" label="Settings" icon="ion-gear-a" />
            <NavItem to="/login" label="Sign in" />
            <NavItem to="/register" label="Sign up" />
          </ul>
        </div>
      </nav>
      {props.children}
      <footer>
        <div className="container">
          <a href="/" className="logo-font">
            conduit
          </a>
          <span className="attribution">
            An interactive learning project from{" "}
            <a href="https://thinkster.io">Thinkster</a>. Code &amp; design
            licensed under MIT.
          </span>
        </div>
      </footer>
    </div>
  );
}

function NavItem(props: {
  to: string;
  label: string;
  icon?: string;
  exact?: boolean;
}): ReactElement {
  const active = useRouteMatch({ path: props.to, exact: props.exact ?? true });
  return (
    <li className="nav-item">
      <Link className={`nav-link ${active ? "active" : ""}`} to={props.to}>
        {props.icon != null ? (
          <>
            <i className={props.icon} /> &nbsp;{props.label}
          </>
        ) : (
          props.label
        )}
      </Link>
    </li>
  );
}

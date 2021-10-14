import { ReactElement } from "react";
import { Link } from "react-router-dom";

export function NotFoundPage(): ReactElement {
  return (
    <div>
      <h1>404</h1>
      <Link to="/">HOME</Link>
    </div>
  );
}

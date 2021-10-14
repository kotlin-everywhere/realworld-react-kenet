import { ReactElement } from "react";

export function SignUpPage(): ReactElement {
  return (
    <div>
      <h1>Sign up pages (URL: /#/register)</h1>
      <ul>
        <li>
          Uses JWT (store the token in localStorage) Authentication can be
          easily
        </li>
        <li>switched to session/cookie based</li>
      </ul>
    </div>
  );
}

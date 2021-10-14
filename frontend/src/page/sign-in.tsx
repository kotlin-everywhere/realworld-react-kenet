import { ReactElement } from "react";

export function SignInPage(): ReactElement {
  return (
    <div>
      <h1>Sign in (URL: /#/login)</h1>
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

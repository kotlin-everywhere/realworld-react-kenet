import { ReactElement } from "react";

export function ProfileFavoritePage(): ReactElement {
  return (
    <div>
      <h1>Profile page (URL: /#/profile/:username/favorites)</h1>
      <ul>
        <li>
          List of articles populated from author's created articles or author's
          favorite articles
        </li>
      </ul>
    </div>
  );
}

import { ReactElement } from "react";

export function HomePage(): ReactElement {
  return (
    <div>
      <h1>Home page (URL: /#/ )</h1>
      <ul>
        <li>List of tags</li>
        <li>List of articles pulled from either Feed, Global, or by Tag</li>
        <li>Pagination for list of articles</li>
      </ul>
    </div>
  );
}

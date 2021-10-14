import { ReactElement } from "react";

export function ArticlePage(): ReactElement {
  return (
    <div>
      <h1>Article page (URL: /#/article/article-slug-here )</h1>
      <ul>
        <li>Delete article button (only shown to article's author)</li>
        <li>Render markdown from server client side</li>
        <li>Comments section at bottom of page</li>
        <li>Delete comment button (only shown to comment's author)</li>
      </ul>
    </div>
  );
}

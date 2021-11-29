import React from "react";
import "./App.css";
import { HashRouter, Route, Switch } from "react-router-dom";
import { HomePage } from "./page/home";
import { NotFoundPage } from "./page/not-found";
import { SignInPage } from "./page/sign-in";
import { SignUpPage } from "./page/sign-up";
import { SettingPage } from "./page/setting";
import { ArticleCreatePage } from "./page/article-create";
import { ArticleEditPage } from "./page/article-edit";
import { ArticlePage } from "./page/artcle";
import { ProfilePage } from "./page/profile";
import { ProfileFavoritePage } from "./page/profile-favorite";
import { Layout } from "./view/layout";

function App() {
  return (
    <HashRouter>
      <Layout>
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/login" component={SignInPage} />
          <Route exact path="/register" component={SignUpPage} />
          <Route exact path="/settings" component={SettingPage} />
          <Route exact path="/editor" component={ArticleCreatePage} />
          <Route exact path="/editor/:slug" component={ArticleEditPage} />
          <Route exact path="/article/:slug" component={ArticlePage} />
          <Route exact path="/profile/username" component={ProfilePage} />
          <Route
            exact
            path="/profile/username/favorites"
            component={ProfileFavoritePage}
          />
          <Route path="/">
            <NotFoundPage />
          </Route>
        </Switch>
      </Layout>
    </HashRouter>
  );
}
export default App;

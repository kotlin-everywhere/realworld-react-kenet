import { useState } from "react";
import { alertErrors, api } from "../api";
import { useHistory } from "react-router-dom";
import { authorized } from "../view/authorized";

export const ArticleCreatePage = authorized((user) => {
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [article, setArticle] = useState("");
  const [tags, setTags] = useState("");

  const onCreate = async () => {
    if (!title.length) {
      alert("Input a title");
      return;
    }
    if (!article.length) {
      alert("Input a article");
      return;
    }

    const res = await api.articleCreate({
      accessToken: user.accessToken,
      article,
      description,
      tags,
      title,
    });
    if (alertErrors(res.errors)) {
      return;
    }
    if (!res.slug) {
      return;
    }

    alert("Created");

    history.push(`/editor/${res.slug}`);
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                // noinspection JSIgnoredPromiseFromCall
                onCreate();
              }}
            >
              <fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    placeholder="Article Title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="What's this article about?"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <textarea
                    className="form-control"
                    rows={8}
                    placeholder="Write your article (in markdown)"
                    value={article}
                    onChange={(e) => setArticle(e.target.value)}
                  />
                </fieldset>
                <fieldset className="form-group">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Enter tags"
                    value={tags}
                    onChange={(e) => setTags(e.target.value)}
                  />
                </fieldset>
                <button className="btn btn-lg pull-xs-right btn-primary">
                  Publish Article
                </button>
              </fieldset>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
});

import { useHistory, useParams } from "react-router-dom";
import { authorized } from "../view/authorized";
import { useEffect, useState } from "react";
import { alertErrors, api } from "../api";

export const ArticleEditPage = authorized((user) => {
  const { slug } = useParams<{ slug?: string }>();
  const history = useHistory();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [article, setArticle] = useState("");
  const [tags, setTags] = useState("");
  const [pk, setPk] = useState(0);

  useEffect(() => {
    const fallback = () => {
      history.replace({ pathname: "/" });
    };

    if (!slug?.length) {
      fallback();
      return;
    }

    api
      .articleEditShow({ accessToken: user.accessToken, slug: slug })
      .then((res) => {
        if (alertErrors(res.errors)) {
          fallback();
          return;
        }
        if (!res.data) {
          return;
        }
        setPk(res.data.pk);
        setTitle(res.data.title);
        setDescription(res.data.description);
        setArticle(res.data.article);
        setTags(res.data.tags.join(", "));
      });
  }, [history, user, slug]);

  const onEdit = async () => {
    if (!slug) {
      alert("Invalid slug url");
      return;
    }

    if (!title.length) {
      alert("Input a title");
      return;
    }
    if (!article) {
      alert("Input an article");
      return;
    }

    const res = await api.articleEdit({
      accessToken: user.accessToken,
      pk,
      title,
      description,
      article,
      tags,
    });
    if (alertErrors(res.errors)) {
      return;
    }
    alert("Edited");
    history.replace({ pathname: `/edit/${res.slug}` });
  };

  return (
    <div className="editor-page">
      <div className="container page">
        <div className="row">
          <div className="col-md-10 offset-md-1 col-xs-12">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                onEdit();
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

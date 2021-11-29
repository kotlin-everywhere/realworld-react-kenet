import { useHistory, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../api";

export const ArticlePage = () => {
  const history = useHistory();
  const { slug } = useParams<{ slug?: string }>();
  const [article, setArticle] = useState<{
    article: string;
    description: string;
    lastUpdatedAt: string;
    pk: number;
    tags: string[];
    title: string;
    userName: string | null;
    userPk: number | null;
    userProfilePictureUrl: string | null;
  } | null>(null);

  useEffect(() => {
    const fallback = () => history.replace({ pathname: "/" });
    if (!slug?.length) {
      fallback();
      return;
    }
    api.articleShow({ slug: slug }).then((res) => {
      if (!res.data) {
        alert("Cannot find an article");
        fallback();
        return;
      }
      setArticle(res.data);
    });
  }, [history, slug]);

  if (article == null) {
    return <></>;
  }

  return (
    <div className="article-page">
      <div className="banner">
        <div className="container">
          <h1>{article.title}</h1>

          <div className="article-meta">
            <a href="">
              <img src="http://i.imgur.com/Qr71crq.jpg" />
            </a>
            <div className="info">
              <a href="" className="author">
                {article.userName}
              </a>
              <span className="date">{article.lastUpdatedAt}</span>
            </div>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round" />
              &nbsp; Follow Eric Simons <span className="counter">(10)</span>
            </button>
            &nbsp;&nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart" />
              &nbsp; Favorite Post <span className="counter">(29)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container page">
        <div className="row article-content">
          <div className="col-md-12">
            <p>{article.description}</p>
            {article.article}
          </div>
        </div>

        <hr />

        <div className="article-actions">
          <div className="article-meta">
            <a href="profile.html">
              <img src="http://i.imgur.com/Qr71crq.jpg" />
            </a>
            <div className="info">
              <a href="" className="author">
                Eric Simons
              </a>
              <span className="date">January 20th</span>
            </div>
            <button className="btn btn-sm btn-outline-secondary">
              <i className="ion-plus-round"></i>
              &nbsp; Follow Eric Simons
            </button>
            &nbsp;
            <button className="btn btn-sm btn-outline-primary">
              <i className="ion-heart"></i>
              &nbsp; Favorite Post <span className="counter">(29)</span>
            </button>
          </div>
        </div>

        <div className="row">
          <div className="col-xs-12 col-md-8 offset-md-2">
            <form className="card comment-form">
              <div className="card-block">
                <textarea
                  className="form-control"
                  placeholder="Write a comment..."
                  rows={3}
                ></textarea>
              </div>
              <div className="card-footer">
                <img
                  src="http://i.imgur.com/Qr71crq.jpg"
                  className="comment-author-img"
                />
                <button className="btn btn-sm btn-primary">Post Comment</button>
              </div>
            </form>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
              </div>
            </div>

            <div className="card">
              <div className="card-block">
                <p className="card-text">
                  With supporting text below as a natural lead-in to additional
                  content.
                </p>
              </div>
              <div className="card-footer">
                <a href="" className="comment-author">
                  <img
                    src="http://i.imgur.com/Qr71crq.jpg"
                    className="comment-author-img"
                  />
                </a>
                &nbsp;
                <a href="" className="comment-author">
                  Jacob Schmidt
                </a>
                <span className="date-posted">Dec 29th</span>
                <span className="mod-options">
                  <i className="ion-edit"></i>
                  <i className="ion-trash-a"></i>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

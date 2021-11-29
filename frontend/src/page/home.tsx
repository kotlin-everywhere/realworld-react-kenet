import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import classNames from "classnames";
import { api } from "../api";
import { siteModel } from "../model";
import { Link } from "react-router-dom";

enum FeedType {
  USER,
  GLOBAL,
}

export const HomePage = observer(() => {
  const [feedType, setFeedType] = useState(FeedType.GLOBAL);
  const [feeds, setFeeds] = useState<
    {
      description: string;
      lastUpdatedAt: string;
      slug: string;
      title: string;
      userName: string;
      userProfilePictureUrl: string;
    }[]
  >([]);

  useEffect(() => {
    api
      .feedList({
        accessToken:
          feedType === FeedType.USER && siteModel.user
            ? siteModel.user.accessToken
            : null,
      })
      .then((res) => {
        setFeeds(res.feeds);
      });
  }, [feedType]);

  return (
    <div className="home-page">
      <div className="banner">
        <div className="container">
          <h1 className="logo-font">conduit</h1>
          <p>A place to share your knowledge.</p>
        </div>
      </div>

      <div className="container page">
        <div className="row">
          <div className="col-md-9">
            <div className="feed-toggle">
              <ul className="nav nav-pills outline-active">
                <li className="nav-item">
                  <button
                    className={classNames("nav-link", {
                      active: siteModel.user && feedType === FeedType.USER,
                      disabled: !siteModel.user || feedType !== FeedType.USER,
                    })}
                    onClick={() => {
                      if (siteModel.user) {
                        setFeedType(FeedType.USER);
                      }
                    }}
                  >
                    Your Feed
                  </button>
                </li>
                <li className="nav-item">
                  <button
                    className={classNames("nav-link", {
                      active: feedType === FeedType.GLOBAL,
                      disabled: feedType !== FeedType.GLOBAL,
                    })}
                    onClick={() => setFeedType(FeedType.GLOBAL)}
                  >
                    Global Feed
                  </button>
                </li>
              </ul>
            </div>

            {feeds.map((feed, index) => {
              return (
                <div className="article-preview" key={index}>
                  <div className="article-meta">
                    <a href="profile.html">
                      <img src="http://i.imgur.com/Qr71crq.jpg" />
                    </a>
                    <div className="info">
                      <a href="#" className="author">
                        {feed.userName}
                      </a>
                      <span className="date">{feed.lastUpdatedAt}</span>
                    </div>
                    <button className="btn btn-outline-primary btn-sm pull-xs-right">
                      <i className="ion-heart" /> 29
                    </button>
                  </div>
                  <Link
                    to={{ pathname: `/article/${feed.slug}` }}
                    className="preview-link"
                  >
                    <h1>{feed.title}</h1>
                    <p>{feed.description}</p>
                    <span>Read more...</span>
                  </Link>
                </div>
              );
            })}
          </div>

          <div className="col-md-3">
            <div className="sidebar">
              <p>Popular Tags</p>

              <div className="tag-list">
                <a href="" className="tag-pill tag-default">
                  programming
                </a>
                <a href="" className="tag-pill tag-default">
                  javascript
                </a>
                <a href="" className="tag-pill tag-default">
                  emberjs
                </a>
                <a href="" className="tag-pill tag-default">
                  angularjs
                </a>
                <a href="" className="tag-pill tag-default">
                  react
                </a>
                <a href="" className="tag-pill tag-default">
                  mean
                </a>
                <a href="" className="tag-pill tag-default">
                  node
                </a>
                <a href="" className="tag-pill tag-default">
                  rails
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

import React, { useEffect, useState } from "react";
import { Link, useLoaderData, useParams } from "react-router-dom";
import { blog_detail } from "../example/blogs";
import parse from "html-react-parser";
import { useUser } from "../hooks/useUser";
import { FaRegHeart, FaLink } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

export const Blog = () => {
  const [data, setData] = useState(useLoaderData());
  const user = useUser(data?.author);

  const [alert, setAlert] = useState(false);

  useEffect(() => {
    // Set meta data for page
    const setMetaData = () => {
      const metaTitle = document.createElement("meta");
      metaTitle.setAttribute("property", "og:title");
      metaTitle.content = data?.title;
      document.head.appendChild(metaTitle);

      const metaDescription = document.createElement("meta");
      metaDescription.setAttribute("property", "og:description");
      metaDescription.content = data?.description;
      document.head.appendChild(metaDescription);

      const metaTags = document.createElement("meta");
      metaTags.setAttribute("property", "og:tags");
      metaTags.content = data?.tags?.join(",");
      document.head.appendChild(metaTags);

      const metaImage = document.createElement("meta");
      metaImage.setAttribute("property", "og:image");
      metaImage.content = data?.image;
      document.head.appendChild(metaImage);
    };

    const metaType = document.createElement("meta");
    metaType.setAttribute("property", "og:type");
    metaType.content = "article";
    document.head.appendChild(metaType);

    const metaUrl = document.createElement("meta");
    metaUrl.setAttribute("property", "og:url");
    metaUrl.content = window.location.href;
    document.head.appendChild(metaUrl);

    const metaAuthor = document.createElement("meta");
    metaAuthor.setAttribute("property", "article:author");
    metaAuthor.content = data?.author;
    document.head.appendChild(metaAuthor);

    setMetaData();

    // Set meta data for share card
    const setShareCardMetaData = () => {
      const shareCardTitle = document.createElement("meta");
      shareCardTitle.setAttribute("property", "twitter:title");
      shareCardTitle.content = data?.title;
      document.head.appendChild(shareCardTitle);

      const shareCardDescription = document.createElement("meta");
      shareCardDescription.setAttribute("property", "twitter:description");
      shareCardDescription.content = data?.description;
      document.head.appendChild(shareCardDescription);

      const shareCardImage = document.createElement("meta");
      shareCardImage.setAttribute("property", "twitter:image");
      shareCardImage.content = data?.image;
      document.head.appendChild(shareCardImage);
    };

    setShareCardMetaData();
  }, [data]);

  function handleLike(e) {
    e.preventDefault();
    if (data?.likes?.includes(user?.username)) {
      setData({
        ...data,
        likes: data.likes.filter((like) => like !== user?.username),
      });
    } else if (data?.likes === undefined) {
      setData({ ...data, likes: [user?.username] });
    } else {
      setData({ ...data, likes: [...data.likes, user?.username] });
    }
  }

  function handleCopyLink(e) {
    e.preventDefault();
    navigator.clipboard.writeText(window.location.href);
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
    }, 3000);
  }

  return (
    <>
      <div
        className={`${
          alert ? "fixed" : "hidden"
        } w-96 bottom-2 right-0 duration-1000 ease-in-out transition-opacity`}
      >
        <div
          id="alert-border-1"
          className="flex items-center p-4 mb-4 text-blue-800 border-t-4 border-blue-300 bg-blue-50 bg-opacity-90 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800"
          role="alert"
        >
          <svg
            className="flex-shrink-0 w-4 h-4"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>
          <div className="ms-3 text-sm font-medium">
            Link is Successfully copied
          </div>
          <button
            type="button"
            className="ms-auto -mx-1.5 -my-1.5 bg-blue-50 text-blue-500 rounded-lg focus:ring-2 focus:ring-blue-400 p-1.5 hover:bg-blue-200 inline-flex items-center justify-center h-8 w-8 dark:bg-gray-800 dark:text-blue-400 dark:hover:bg-gray-700"
            data-dismiss-target="#alert-border-1"
            aria-label="Close"
            onClick={(e) => {
              e.preventDefault();
              setAlert(false);
            }}
          >
            <span className="sr-only">Dismiss</span>
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
          </button>
        </div>
      </div>
      <article className="m-20 text-justify font-serif flex flex-wrap flex-col border-4 px-8 py-4 rounded-t-3xl rounded-b-xl border-gray-800 bg-gray-200">
        <h1 className="text-5xl font-bold my-2 flex flex-wrap flex-col justify-center items-start gap-2">
          <div className="flex flex-wrap flex-row">{data?.title}</div>
          {user && (
            <div className="mx-3 flex flex-wrap flex-row text-lg font-thin italic items-center text-gray-600 gap-2">
              <Link to={`/user/${user?.username}`} className="hover:shadow-lg ">
                <img
                  src={user?.avatar}
                  alt={user?.name}
                  className="rounded-full h-8"
                />
              </Link>
              <span className="">
                By
                <Link
                  to={`/user/${user?.username}`}
                  className="hover:underline hover:text-black"
                >
                  {" "}
                  {user?.name}
                </Link>
              </span>
              <span className="">
                On {new Date(data?.created_on).toDateString()}
              </span>
            </div>
          )}
        </h1>
        {data?.description && (
          <p className="text-lg font-thin my-3 italic text-gray-600">
            {data?.description}
          </p>
        )}
        {data?.image && (
          <div className="mx-12 my-4">
            <img
              src={data?.image}
              alt={data?.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}
        <div className="mx-5 text-xl">{parse(data?.content)}</div>
        {data?.tags?.length > 0 && (
          <div className="my-4 mx-5 ">
            <ul className="flex flex-wrap flex-row gap-3">
              {data?.tags?.map((tag, index) => (
                <li key={index}>
                  <Link
                    to={`/blog/?tag=${tag}`}
                    className="hover:text-black hover:border-gray-700 hover:bg-gray-200 bg-gray-700 text-lg text-white px-4 py-1 rounded-full border-2 border-white"
                  >
                    {tag}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
        <div className="flex flex-wrap flex-row gap-5 mx-5 items-center justify-start">
          {data?.likes ? (
            <>
              <div className="flex flex-wrap flex-row justify-start items-center h-fit duration-600 my-2">
                <button onClick={handleLike}>
                  {data?.likes?.includes(user?.username) ? (
                    <FaHeart size={32} className="text-red-500" />
                  ) : (
                    <FaRegHeart size={32} />
                  )}
                </button>
                <span className="mx-2 text-2xl">{data?.likes?.length}</span>
              </div>
            </>
          ) : (
            <button
              className="flex flex-wrap flex-row my-2 h-fit"
              onClick={handleLike}
            >
              <FaRegHeart size={32} />
              <span className="mx-2 text-2xl">0</span>
            </button>
          )}
          <div className=" h-fit duration-600 my-2">
            <button
              title="Copy Link"
              className="flex flex-wrap flex-row justify-start items-center"
              onClick={handleCopyLink}
            >
              <FaLink size={24} className="text-black" />
              <span className="mx-2 text-xl">Copy Link</span>
            </button>
          </div>
        </div>
      </article>
    </>
  );
};

export const fetchBlog = async (id) => {
  console.log(id);
  return blog_detail;
};

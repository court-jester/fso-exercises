const dummy = blogs => {
  return 1;
};

const totalLikes = blogs => {
  const reducer = (sum, item) => {
    return sum + item.likes;
  };

  return blogs.length === 0 ? 0 : blogs.reduce(reducer, 0);
};

const favoriteBlog = blogs => {
  /** To just get the likes of the most liked blog
   const mostLiked = Math.max(...blogs.map(blog => blog.likes));
  */
  const reducer = (mostLiked, item) => {
    return mostLiked.likes > item.likes ? mostLiked : item;
  };
  // Format the blogs to not show their _id, __v and url
  const mostLikedBlog = blogs
    .map(({ title, author, likes }) => ({ title, author, likes }))
    .reduce(reducer, 0);

  return blogs.length === 0 ? [] : mostLikedBlog;
};

const mostBlogs = blogs => {
  if (blogs.length === 0) {
    return [];
  }

  const reducer = (acc, cur) => {
    acc[cur.author] ? acc[cur.author]++ : (acc[cur.author] = 1);
    return acc;
  };

  const reducer2 = (mostProlificAuthor, cur) => {
    return (mostProlificAuthor[1] || -Infinity) >= cur[1]
      ? mostProlificAuthor
      : cur;
    // return Math.max(cur[1], mostProlificAuthor[1]);
  };

  const authors = blogs.reduce(reducer, {});

  const arrAuthors = Object.entries(authors);
  const mostProlificAuthor = arrAuthors.reduce(reducer2, {});

  const formatProlificAuthor = {
    author: mostProlificAuthor[0],
    blogs: mostProlificAuthor[1]
  };
  return formatProlificAuthor;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs
};

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
  const mostLikedBlog = blogs.reduce(reducer, 0);
  // Format the mostLikedBlog
  delete mostLikedBlog.url;
  delete mostLikedBlog._id;
  delete mostLikedBlog.__v;

  return blogs.length === 0 ? [] : mostLikedBlog;
};

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog
};

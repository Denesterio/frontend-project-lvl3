export default (doc, id, url) => {
  const parser = new DOMParser();
  const parsed = parser.parseFromString(doc, 'text/xml');
  const title = parsed.querySelector('title');
  const description = parsed.querySelector('description');
  const link = parsed.querySelector('link');
  const feed = {
    id,
    link: link.textContent,
    title: title.textContent,
    description: description.textContent,
    stream: url,
  };

  const items = parsed.querySelectorAll('item');
  const posts = [...items].map((item) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description').textContent;
    const postLink = item.querySelector('link').textContent;
    return {
      title: postTitle,
      description: postDescription,
      link: postLink,
    };
  });
  const postObject = { id, posts };

  return [feed, postObject];
};

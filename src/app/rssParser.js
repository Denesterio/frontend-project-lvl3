export default (dataContent, id, url) => {
  const parser = new DOMParser();
  const parsedRSS = parser.parseFromString(dataContent, 'text/xml');
  const channel = parsedRSS.querySelector('channel');
  const elements = [...channel.children];
  const title = elements.find((elem) => elem.tagName === 'title').textContent;
  const description = elements.find((elem) => elem.tagName === 'description')?.textContent;
  const link = elements.find((elem) => elem.tagName === 'link')?.textContent;
  const feed = {
    id,
    title,
    link: link ?? '',
    description: description ?? '',
    stream: url,
  };

  const posts = elements.filter((elem) => elem.tagName === 'item').map((item, index) => {
    const postTitle = item.querySelector('title').textContent;
    const postDescription = item.querySelector('description')?.textContent;
    const postLink = item.querySelector('link').textContent;
    const pubDate = item.querySelector('pubDate').textContent;
    return {
      feedId: id,
      id: String(id) + String(index),
      title: postTitle,
      description: postDescription ?? '',
      link: postLink,
      pubDate,
    };
  });

  return [feed, posts];
};

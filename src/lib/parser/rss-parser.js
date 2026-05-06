export const parseRSS = (xmlString, feedUrl) => {
  return new Promise((resolve, reject) => {
    try {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
      
      const parserError = xmlDoc.querySelector('parsererror');
      if (parserError) {
        reject(new Error('Невалидный RSS формат'));
        return;
      }
      
      const channel = xmlDoc.querySelector('channel');
      if (!channel) {
        reject(new Error('RSS не содержит канала'));
        return;
      }
      
      const title = channel.querySelector('title')?.textContent || 'Без названия';
      const description = channel.querySelector('description')?.textContent || 'Нет описания';
      
      const items = channel.querySelectorAll('item');
      const posts = Array.from(items).map((item, index) => {
        const postTitle = item.querySelector('title')?.textContent || 'Без заголовка';
        const link = item.querySelector('link')?.textContent || '';
        const postDescription = item.querySelector('description')?.textContent || 'Нет описания';
        const pubDate = item.querySelector('pubDate')?.textContent || new Date().toUTCString();
        
        return {
          id: generateId(),
          feedId: feedUrl, 
          title: postTitle,
          link: link,
          description: postDescription,
          pubDate: pubDate,
        };
      });
      
      resolve({
        feed: {
          title,
          description,
          url: feedUrl,
        },
        posts,
      });
    } catch (error) {
      reject(new Error('Ошибка при парсинге RSS: ' + error.message));
    }
  });
};

const generateId = () => Date.now().toString() + Math.random().toString(36).substring(2, 8);

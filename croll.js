const axios = require('axios');
const cheerio = require('cheerio');

async function fetchAnnouncements(pageNumber) {
  const baseUrl = 'https://www.ansan.ac.kr/www/board/11/';
  const url = `${baseUrl}${pageNumber || '1'}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const announcements = [];

    $('.text-left a').each((index, element) => {
      const title = $(element).text().trim();
      const link = `https://www.ansan.ac.kr${$(element).attr('href')}`;
      
      // 작성일 가져오는 코드
      const $parentRow = $(element).closest('tr');
      const date = $parentRow.find('td').eq(2).text().trim();

      announcements.push({
        title,
        link,
        date,
      });
    });

    console.log(announcements);

    if (pageNumber < 3) { 
      const nextPageNumber = pageNumber + 1;
      await fetchAnnouncements(nextPageNumber);
    }
  } catch (error) {
    console.error('에러 발생:', error);
  }
}

fetchAnnouncements(1);

// node croll.js로 실행
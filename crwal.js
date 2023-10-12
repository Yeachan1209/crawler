const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs');
const path = require('path');

async function fetchAnnouncements(pageNumber) {
  const baseUrl = 'https://www.snu.ac.kr/snunow/notice/genernal?page=';
  const url = `${baseUrl}${pageNumber}`;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const $ = cheerio.load(html);

    const announcements = [];

    // 제목, 링크, 작성일 가져오는 코드
    $('.text-left a').each((index, element) => {
      const title = $(element).text().trim();
      const link = `https://www.snu.ac.kr/${$(element).attr('href')}`;

      // 작성일 가져오는 코드
      const $parentRow = $(element).closest('tr');
      const date = $parentRow.find('td').eq(2).text().trim();

      announcements.push({
        title,
        link,
        date,
      });
    });

    // 파일을 폴더에 저장하는 코드
    const outputDir = path.join(__dirname, 'txt'); // 폴더생성
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir);
    }
    const filePath = path.join(outputDir, `announcements_page_${pageNumber}.txt`);
    fs.writeFileSync(filePath, JSON.stringify(announcements, null, 2));
  } catch (error) {
    console.error('에러 발생:', error);
  }
}

fetchAnnouncements();

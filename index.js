const puppeteer = require('puppeteer');
const url = 'https://l508-08.is.oit.ac.jp/tsh/';

(async function(){
    const browser = await puppeteer.launch({
        headless: true
    });
    const page = await browser.newPage();
    const response = await page.goto(url);

    const votes = await page.evaluate(() => {
      // 研究室情報が載ってるテーブル
      const table = Array.from(document.querySelectorAll('table table'))[1];

      // 各研究室のリスト
      const labos = Array.from(table.querySelectorAll('tbody tr td tbody tr'));
      labos.shift();

      return labos.map(line => {
        const line_arr   = Array.from(line.querySelectorAll('td'));
        try {
          const labo_name  = line_arr[0].innerHTML.toString().replace('　',' ');
          const labo_limit = line_arr[2].innerHTML.toString();
          const law_labo_cnt = line_arr[3].innerHTML.toString();

          // 場合によっては<font><b>data(noise)</b></font>に囲まれているので除去
          let labo_cnt;
          if (law_labo_cnt[0] == '<') {
            labo_cnt = law_labo_cnt.split('>')[2].split('<')[0];
          } else {
            labo_cnt = law_labo_cnt;
          }
          labo_cnt = labo_cnt.split('(')[0];

          return {name: labo_name, cnt: labo_cnt, limit: labo_limit, err: null};
        } catch (e) {
          return {err: e}
        }
      }).filter(elm => elm.err==null);
    });
    votes.map(x => console.log(x.name + ", " + x.cnt + ", " + x.limit));
    await browser.close();
})();

// <tr class="odd">
//   <td>hoge</td>
//   <td>情報通信ネットワーク</td>
//   <td style="text-align:center;">10</td>
//   <td style="text-align:center;"><font color="red"><b>11</b></font>(1,0,0,10)</td>
// </tr>

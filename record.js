// const needGARecord = location.href.indexOf('正式线上cdn域名');
let curChapterIndex = 1;
let novelChapterCount = 0; //小说章节数
let chapterRecord = {}; //章节打点数据
let chapterHeight = {}; //各章节高、顶部距离文档顶部距离、底边距离文档顶部距离
window.initChapterRecord = function(num) {
  if (num > 0) {
    novelChapterCount = num;
    let i;
    for (i = 0; i < num; i++) {
      if (!chapterRecord[`chapter__${i + 1}`]) {
        chapterRecord[`chapter__${i + 1}`] = {};
      }
    }
  }
};

window.initChapterHeight = function() {
  let len = novelChapterCount;
  let dom1, dom2;
  for (i = 0; i < len; i++) {
    if (!chapterHeight[`chapter__${i + 1}`]) {
      if (i != len - 1) {
        dom1 = document.getElementById(`chapter__${i + 1}`);
        dom2 = document.getElementById(`chapter__${i + 2}`);
      } else {
        dom1 = document.getElementById(`chapter__${i + 1}`);
        dom2 = document.getElementsByClassName(`detail-btn`)[0];
      }
      if (dom1 && dom2) {
        dom1 = dom1.getBoundingClientRect();
        dom2 = dom2.getBoundingClientRect();
        chapterHeight[`chapter__${i + 1}`] = {
          height: dom2.top - dom1.top,
          top: dom1.top,
          bottom: dom2.top
        };
      }
    }
  }
};

const RECORD_PATH = {
  HOMEPAGE: 'homepage_enter', // 进入主页
  DETAIL: 'detail_enter', // 进入封面页
  READING: 'reading_enter', // 进入阅读页
  START_READING: 'start_reading', // 点击开始阅读按钮
  NEXT_CHAPTER: 'next_chapter', // 点击下一章节按钮
  PREV_CHAPTER: 'prev_chapter', // 点击上一章节按钮
  CHAPTER_QUARTER: 'reading_quarter', // 阅读超过1/4
  CHAPTER_HALF: 'reading_half', // 阅读超过1半
  CHAPTER_THREE_QUARTER: 'reading_three_quarter', // 阅读超过3/4
  CHAPTER_FINISH: 'reading_finish' // 阅读完成
};

function record(path, category, label, value) {
  console.log(`>> record: ${path} ${category} ${label} ${value}`);
  window.gtag('event', path, {
    event_category: category,
    event_label: label,
    value: value
  });
}

function recordPage(page, page_title) {
  const _page = page.replace(/(\ |:|\?)/gi, '_');
  console.log('recordPage: %s', _page);
  window.gtag('config', 'UA-146920084-1', {
    page_title: page_title,
    page_path: _page
  });
}

function recordTime(name, value, category) {
  console.log(`>> recordTime: ${name} ${value} ${category}`);
  window.gtag('event', 'timing_complete', {
    name: name,
    value: value,
    event_category: category
  });
}

/**
 * get the query value from url
 * @param key key of the query
 * @param defaultVal the default value of query
 */
function getQueryValue(key, defaultVal) {
  const reg = new RegExp('(^|&)' + key + '=([^&]*)(&|$)', 'i');
  const r = window.location.search.substr(1).match(reg);
  if (r !== null) return unescape(r[2]);
  return defaultVal;
}

window.RECORD_PATH = RECORD_PATH;
window.record = record;
window.recordPage = recordPage;
window.recordTime = recordTime;
window.getQueryValue = getQueryValue;

// ================ action ======================
let bookID = getQueryValue('book_id');
let bookName = getQueryValue('book_name');
record(RECORD_PATH.HOMEPAGE, 'enter', RECORD_PATH.HOMEPAGE, '');
record(RECORD_PATH.DETAIL, 'enter', bookID, '');

let contentDOM = document.getElementById('content');
let wHeight = contentDOM.offsetHeight; //文档长度

// reading_enter
let _marginTop = 0;
function gaChapterReadingEnter() {
  for (let key in chapterRecord) {
    _marginTop = chapterHeight[key]['top'] - contentDOM.scrollTop;
    if (_marginTop > 0 && _marginTop < wHeight && !chapterRecord[key]['reading_enter']) {
      chapterRecord[key]['reading_enter'] = true;
      record(RECORD_PATH.READING, 'enter', `${bookID}_${bookName}_${key.split('__')[1]}`, '');
      curChapterIndex = key.split('__')[1];
    }
  }
}

// scroll progress
let bilv = 0;
let _top;
let _bottom;
function gaChapterProgress() {
  for (let key in chapterRecord) {
    if (chapterRecord[key]['reading_enter']) {
      _top = chapterHeight[key]['top'] - contentDOM.scrollTop;
      _bottom = chapterHeight[key]['bottom'] - contentDOM.scrollTop;
      if (_bottom >= wHeight) {
        bilv = 1 - (_bottom - wHeight) / chapterHeight[key]['height'];
        if (bilv >= 0.25 && bilv < 0.5 && !chapterRecord[key][RECORD_PATH.CHAPTER_QUARTER]) {
          // 1/4
          chapterRecord[key][RECORD_PATH.CHAPTER_QUARTER] = true;
          record(RECORD_PATH.CHAPTER_QUARTER, 'reading', `${bookID}_${bookName}_${curChapterIndex}`, '');
        } else if (bilv >= 0.5 && bilv < 0.75 && !chapterRecord[key][RECORD_PATH.CHAPTER_HALF]) {
          // 1/2
          chapterRecord[key][RECORD_PATH.CHAPTER_HALF] = true;
          record(RECORD_PATH.CHAPTER_HALF, 'reading', `${bookID}_${bookName}_${curChapterIndex}`, '');
        } else if (bilv >= 0.75 && bilv < 1 && !chapterRecord[key][RECORD_PATH.CHAPTER_THREE_QUARTER]) {
          // 3/4
          chapterRecord[key][RECORD_PATH.CHAPTER_THREE_QUARTER] = true;
          record(RECORD_PATH.CHAPTER_THREE_QUARTER, 'reading', `${bookID}_${bookName}_${curChapterIndex}`, '');
        }
      } else if (_bottom <= wHeight && !chapterRecord[key][RECORD_PATH.CHAPTER_FINISH]) {
        chapterRecord[key][RECORD_PATH.CHAPTER_FINISH] = true;
        record(RECORD_PATH.CHAPTER_FINISH, 'reading', `${bookID}_${bookName}_${curChapterIndex}`, '');
      }
    }
  }
}
window.gaChapterReadingEnter = gaChapterReadingEnter;
window.gaChapterProgress = gaChapterProgress;

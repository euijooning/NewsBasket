const API_KEY = "4e15c1245600477d85258dae3f69da39";
let newsList = [];

const topics = document.querySelectorAll(".topics button");
topics.forEach((topic) =>
  topic.addEventListener("click", (event) => getNewsByCategory(event))
);

// URL도 전역변수로 빼버리기
let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
);

let totalResults = 0;
let page = 1;
const pageSize = 10;
const groupSize = 5; // 이 두개는 불변해야 하는 값.

async function getLatestNews() {
  // url 설정
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );
  getNews();
}

async function getNewsByCategory(event) {
  const category = event.target.textContent.toLowerCase();
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&category=${category}&apiKey=${API_KEY}`
  );
  getNews();
}

async function getNewsByKeyword() {
  const keyword = document.getElementById("keyword-input").value;
  url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&q=${keyword}&apiKey=${API_KEY}`
  );
  getNews();
}

// 겹치는 부분 함수로 묶어서 refactor
const getNews = async () => {
  try {
    const response = await fetch(url);
    const data = await response.json();

    if (response.status === 200) {
      if (data.articles.length === 0) {
        // 검색 결과가 존재하지 않는 경우(기사 0개) 예외처리
        throw new Error("There are no results for this search.");
      }
      newsList = data.articles;
      totalResults = data.totalResults; // 추가
      render();
      paginationRender(); // 추가
    } else {
      throw new Error(data.message);
    }
  } catch (error) {
    // console.log("error", error.message);
    errorRender(error.message);
  }
};

// 유저에게 에러 메시지 출력해주는 함수
const errorRender = (errorMessage) => {
  const errorHTML = `<div class="alert alert-dark" role="alert">
  ${errorMessage}
</div>`;
  document.getElementById("news-posts").innerHTML = errorHTML;
};

// 페이지네이션 함수
const paginationRender = () => {
  // totalResults
  // page
  // pageSize
  // groupSize
  // totalPages

  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  const lastPage = pageGroup * groupSize;
  // firstPage
  const firstPage = lastPage - (groupSize - 1);

  let paginationHTML = ``;
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
  }

  document.querySelector(".pagination").innerHTML = paginationHTML;
};

// 뉴스 정보 가져오기
const render = () => {
  // const는 재할당이 안 되므로 바로 그냥 값을 줘버린다.
  const newsHTML = newsList
    .map((news) => {
      // 날짜 포맷팅 함수
      const formattedDate = new Date(news.publishedAt).toLocaleString();

      return `<div class="row news">
        <div class="col-lg-4"> 
            <img class="news-img" src=${news.urlToImage}>
        </div>
        <div class="col-lg-8">
            <h2>${news.title}</h2>
            <p>
                ${news.description}
            </p>
            <div>
                ${news.source.name} * ${formattedDate}
            </div>
        </div>
    </div>`;
    })
    .join("");

  document.getElementById("news-posts").innerHTML = newsHTML;
};

getLatestNews(); // 함수 실행
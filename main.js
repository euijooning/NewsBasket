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
    // 일일이 pageNumber 넣기 귀찮으니까 url 호출 전에 파라미터로 붙여서 세팅해버리기
    url.searchParams.set("page", page); // 형태 : &page=page
    url.searchParams.set("pageSize", pageSize); // &pageSize=pageSize
    
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

  // pageGroup
  const pageGroup = Math.ceil(page / groupSize);
  // lastPage
  const lastPage = pageGroup * groupSize;

  // totalPage 도 정의
  const totalPages = Math.ceil(totalResults / pageSize)
  // (추가) 만약 마지막 pageGroup이 groupSize보다 작다? 이 때는 lastPage = totalPages 가 되게 해야.
  if(lastPage > totalPages) {
    lastPage = totalPages
  }

  // firstPage
  // 여기도 혹여 음수나올 수 있으므로 추가로 처리해준다.
  const firstPage = lastPage-(groupSize-1) < 0? 1: lastPage-(groupSize-1);

  let paginationHTML = ``;
  for (let i = firstPage; i <= lastPage; i++) {
    paginationHTML += `<li class="page-item ${i===page ? "active" : ""}" onclick="navigateToPage(${i})"><a class="page-link">${i}</a></li>`;
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


// 페이지 이동 함수
const navigateToPage = (pageNumber) => {
  // 다시 뉴스를 가져와야함.
  page = pageNumber; // 페이지 번호 재세팅
  getNews();
};

getLatestNews(); // 함수 실행
const API_KEY = "4e15c1245600477d85258dae3f69da39";
let newsList = [];

const topics = document.querySelectorAll(".topics button");
topics.forEach((topic) =>
  topic.addEventListener("click", (event) => getNewsByCategory(event))
);
// 이 부분에서는 각각의 버튼에 대해 클릭 이벤트를 추가하고, 클릭되면 getNewsByCategory 함수를 호출한다.

// URL도 전역변수로 빼버리기
let url = new URL(
  `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
);

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
    if(response.status === 200) {
      newsList = data.articles; 
      render();
    } else {
      throw new Error(data.message);
    }   
  } catch(error) {
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

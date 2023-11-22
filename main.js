const API_KEY = "4e15c1245600477d85258dae3f69da39";
let newsList = [];

async function getLatestNews() {
  // url 설정
  let url = new URL(
    `https://newsapi.org/v2/top-headlines?country=us&apiKey=${API_KEY}`
  );

  const response = await fetch(url); // 이 url 주소로 데이터 가져오기
  const data = await response.json();

  newsList = data.articles; // 값 확정
  // 여기서 render()를 불러야 한다.
  render();
  console.log("info", newsList);
}

// 뉴스 정보 가져오기
const render = () => {
    // const는 재할당이 안 되므로 바로 그냥 값을 줘버린다.
    const newsHTML = newsList.map((news) => {
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
    }).join('');
  document.getElementById("news-posts").innerHTML = newsHTML;
};

getLatestNews(); // 함수 실행

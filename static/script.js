// Current settings
let currentCategory = "general";
let currentCountry = "us";

// Load news when page opens
window.onload = function () {
    loadNews();
    loadBreakingNews();
};

// -------------------------------
// Load Top Headlines
// -------------------------------
function loadNews() {

    fetch(`/news?category=${currentCategory}&country=${currentCountry}`)
        .then(response => response.json())
        .then(data => {

            if (data.success) {
                displayNews(data.articles);
            } else {
                alert(data.message);
            }

        })
        .catch(error => console.log(error));
}

// -------------------------------
// Display News Cards
// -------------------------------
function displayNews(articles) {

    const container = document.getElementById("newsContainer");

    container.innerHTML = "";

    if (articles.length === 0) {
        container.innerHTML =
        "<h2 style='text-align:center;'>No news found.</h2>";
        return;
    }

    articles.forEach(article => {

        container.innerHTML += `

        <div class="news-card">

            <img src="${article.image || 'https://via.placeholder.com/400x220?text=No+Image'}">

            <div class="news-content">

                <h2>${article.title}</h2>

                <p>${article.description || "No description available."}</p>

                <div class="news-info">

                    <b>Source:</b> ${article.source}<br>

                    <b>Published:</b>
                    ${new Date(article.published).toLocaleString()}

                </div>

                <a href="${article.url}"
                   target="_blank">

                   Read More

                </a>

            </div>

        </div>

        `;

    });

}

// -------------------------------
// Search News
// -------------------------------
function searchNews() {

    const keyword =
        document.getElementById("searchInput").value.trim();

    if (keyword === "") {
        alert("Please enter something to search.");
        return;
    }

    fetch(`/news?search=${encodeURIComponent(keyword)}`)

        .then(response => response.json())

        .then(data => {

            if (data.success) {
                displayNews(data.articles);
            } else {
                alert(data.message);
            }

        });

}

// -------------------------------
// Press Enter to Search
// -------------------------------

document
.getElementById("searchInput")
.addEventListener("keypress", function(event){

    if(event.key === "Enter"){
        searchNews();
    }

});

// -------------------------------
// Load Category
// -------------------------------

function loadCategory(category){

    currentCategory = category;

    loadNews();

}

// -------------------------------
// Change Country
// -------------------------------

function changeCountry(){

    currentCountry =
    document.getElementById("country").value;

    loadNews();

}

// -------------------------------
// Breaking News Banner
// -------------------------------

function loadBreakingNews(){

    fetch("/breaking")

    .then(response => response.json())

    .then(data=>{

        document
        .getElementById("breakingNews")
        .innerHTML = data.join(" 🔴 ");

    });

}
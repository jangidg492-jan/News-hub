from flask import Flask, request, jsonify, render_template
import requests
import os

app = Flask(__name__)

API_KEY = os.getenv("11c2bdbd136a44a6a7d559755a46424c")  

@app.route("/")
def home():
    return render_template("index.html",app_name="RG News")

@app.route("/news", methods=["GET"])
def get_news():

    category = request.args.get("category")
    search = request.args.get("search")
    country = request.args.get("country", "us")

    if search:
        url = f"https://newsapi.org/v2/everything?q={search}&language=en&sortBy=publishedAt&apiKey={API_KEY}"
    else:
        if not category:
            category = "general"

        url = f"https://newsapi.org/v2/top-headlines?country={country}&category={category}&apiKey={API_KEY}"

    response = requests.get(url)
    data = response.json()

    if data["status"] != "ok":
        return jsonify({
            "success": False,
            "message": data.get("message", "Unable to fetch news.")
        }), 400

    articles = []

    for article in data["articles"]:
        articles.append({
            "title": article["title"],
            "description": article["description"],
            "source": article["source"]["name"],
            "author": article["author"],
            "published_at": article["publishedAt"],
            "image": article["urlToImage"],
            "url": article["url"]
        })

    return jsonify({
        "success": True,
        "total_results": len(articles),
        "articles": articles
    })

if __name__ == "__main__":
    app.run(debug=True)
let tweet_array = [];
let written_tweets = [];

function parseTweets(runkeeper_tweets) {
    //Do not proceed if no tweets loaded
    if (runkeeper_tweets === undefined) {
        window.alert('No tweets returned');
        return;
    }

    // Create Tweet objects and filter written ones
    for (let i = 0; i < runkeeper_tweets.length; i++) {
        let tweet = new Tweet(runkeeper_tweets[i].text, runkeeper_tweets[i].created_at);
        tweet_array.push(tweet);

        if (tweet.written) {
            written_tweets.push(tweet);
        }
    }
}

function addEventHandlerForSearch() {
    const searchBox = document.getElementById("textFilter");
    const countSpan = document.getElementById("searchCount");
    const textSpan = document.getElementById("searchText");
    const tableBody = document.getElementById("tweetTable");

    searchBox.addEventListener("input", function () {
        const query = searchBox.value.toLowerCase();

        // Clear previous results
        tableBody.innerHTML = "";

        if (query === "") {
            countSpan.innerText = "0";
            textSpan.innerText = "";
            return;
        }

        let matchCount = 0;

        // Check each written tweet manually
        for (let i = 0; i < written_tweets.length; i++) {
            let tweetText = written_tweets[i].text.toLowerCase();
            if (tweetText.includes(query)) {
                matchCount++;
                let rowHTML = written_tweets[i].getHTMLTableRow(matchCount - 1);
                tableBody.insertAdjacentHTML("beforeend", rowHTML);
            }
        }

        // Update counts
        countSpan.innerText = matchCount;
        textSpan.innerText = query;
    });
}

// Wait for the DOM to load
document.addEventListener("DOMContentLoaded", function (event) {
    addEventHandlerForSearch();
    loadSavedRunkeeperTweets().then(parseTweets);
});

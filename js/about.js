function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}

	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});
	
	//This line modifies the DOM, searching for the tag with the numberTweets ID and updating the text.
	//It works correctly, your task is to update the text of the other tags in the HTML file!
	document.getElementById('numberTweets').innerText = tweet_array.length;

	//parsing tweets to find the earliest and latest tweet + also gathering numbers of categories
	let earliest = tweet_array[0].time;
	let latest = tweet_array[0].time;
	let completedEvents = 0;
	let liveEvents = 0;
	let achievements = 0;
	let miscellaneous = 0;
	let userWritten = 0;
	for (let i = 0; i < tweet_array.length; i++){
		if (tweet_array[i].written){
			userWritten += 1;
		}
		if (tweet_array[i].source == "completed_event"){
			completedEvents += 1;
		} else if (tweet_array[i].source == "live_event") {
			liveEvents += 1;
		} else if (tweet_array[i].source == "achievement"){
			achievements += 1;
		} else if (tweet_array[i].source == "miscellanous") {
			miscellaneous += 1;
		}

		if (earliest > tweet_array[i].time){
			earliest = tweet_array[i].time;
		}
		if (latest < tweet_array[i].time){
			latest = tweet_array[i].time;
		}
	}

	//referencing html to earliest and latest tweet
	document.getElementById('firstDate').innerText = earliest.toLocaleDateString();
	document.getElementById('lastDate').innerText = latest.toLocaleDateString();

	//referencing html for categories
	let completedEventsNodes;
	completedEventsNodes = document.querySelectorAll('.completedEvents');
	for (let i = 0; i < completedEventsNodes.length; i++){		
		completedEventsNodes[i].textContent = completedEvents;
	}
	document.querySelector(".completedEventsPct").innerText = math.format((completedEvents / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	document.querySelector('.liveEvents').innerText = liveEvents;
	document.querySelector(".liveEventsPct").innerText = math.format((liveEvents / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	document.querySelector('.achievements').innerText = achievements;
	document.querySelector(".achievementsPct").innerText = math.format((achievements / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	document.querySelector('.miscellaneous').innerText = miscellaneous;
	document.querySelector(".miscellaneousPct").innerText = math.format((miscellaneous / tweet_array.length) * 100, { notation: 'fixed', precision: 2 });
	document.querySelector(".written").innerText = userWritten;
	document.querySelector(".writtenPct").innerText = math.format((userWritten / completedEvents) * 100, { notation: 'fixed', precision: 2 });

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
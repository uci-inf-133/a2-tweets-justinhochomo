function parseTweets(runkeeper_tweets) {
	//Do not proceed if no tweets loaded
	if(runkeeper_tweets === undefined) {
		window.alert('No tweets returned');
		return;
	}
	
	tweet_array = runkeeper_tweets.map(function(tweet) {
		return new Tweet(tweet.text, tweet.created_at);
	});

	let activities = new Map();
	let longestActivity;
	let shortestActivity;
	let longestDistance;
	let shortestDistance;
	let day;
	for (let i = 0;  i < tweet_array.length; i++){
		if (tweet_array[i].source !== "completed_event") {
   			continue;
		} else {
			longestDistance = tweet_array[i].distance;
			shortestDistance = tweet_array[i].distance;
			longestActivity = tweet_array[i].activityType;
			shortestActivity = tweet_array[i].activityType;
			break;
		}
	}


	for (let i = 0;  i < tweet_array.length; i++){
		if (tweet_array[i].source !== "completed_event") {
   			continue;
		}
		let activity = tweet_array[i].activityType;
		if (!(activities.has(activity))){
			activities.set(activity, 1);
		} else {
			activities.set(activity, activities.get(activity) + 1);
		}

		if (tweet_array[i].distance > longestDistance){
			longestDistance = tweet_array[i].distance;
			longestActivity = tweet_array[i].activityType;
			day = tweet_array[i].time.getDay();
		}
		if (tweet_array[i].distance < shortestDistance){
			shortestDistance = tweet_array[i].distance;
			shortestActivity = tweet_array[i].activityType;
		}
	}
	if (day == 0 || day == 6){
		day = "weekend"
	} else {
		day = "weekday"
	}


	let activityArray = [...activities.entries()].sort((a, b) => b[1] - a[1]);
	document.getElementById("firstMost").innerText = activityArray[0][0];
	document.getElementById("secondMost").innerText = activityArray[1][0];
	document.getElementById("thirdMost").innerText = activityArray[2][0];
	document.getElementById("numberActivities").innerText = activities.size;
	document.getElementById("longestActivityType").innerText = longestActivity;
	document.getElementById("shortestActivityType").innerText = shortestActivity;
	document.getElementById("weekdayOrWeekendLonger").innerText = day;


	//TODO: create a new array or manipulate tweet_array to create a graph of the number of tweets containing each type of activity.

	activity_vis_spec = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	"description": "A graph of the number of Tweets containing each type of activity.",
	"data": {
	"values": tweet_array
	},
	"mark" : "point",
	"encoding": {
	"x": { "field": "activityType", 
		"type": "nominal", 
		"title": "Activity type" 
	},
	"y": { "aggregate": "count", 
		"type": "quantitative", 
		"title": "Number of tweets" 
	},
	"color": { "field": "activityType",
		"type": "nominal" 
		}
	}
	};
	vegaEmbed('#activityVis', activity_vis_spec, {actions:false});

	//TODO: create the visualizations which group the three most-tweeted activities by the day of the week.
	//Use those visualizations to answer the questions about which activities tended to be longest and when.

	distance_by_day_spec = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	"description": "Distances by day of week for top 3 activities.",
	"data": { "values": tweet_array },
	"mark": "point",
	"encoding": {
		"x": {
		"field": "day",         
		"type": "ordinal",
		"title": "Day of the week",
		
		},
		"y": {
		"field": "distance", 
		"type": "quantitative",
		"title": "Distance"
		},
		"color": {
		"field": "activityType",
		"type": "nominal"
		}
	}
	};
	vegaEmbed('#distanceVis', distance_by_day_spec, { actions: false });

	distance_by_day_mean_spec = {
	"$schema": "https://vega.github.io/schema/vega-lite/v5.json",
	"description": "Mean distances by day of week for top 3 activities.",
	"data": { "values": tweet_array },
	"mark": "point",
	"encoding": {
		"x": {
		"field": "day",
		"type": "ordinal",
		"title": "Day of the week"
		},
		"y": {
		"aggregate": "mean",
		"field": "distance",
		"type": "quantitative",
		"title": "Mean of Distance"
		},
		"color": {
		"field": "activityType",
		"type": "nominal"
		}
	}
	};

	let showMean = false;

	document.getElementById("aggregate").addEventListener("click", () => {
	showMean = !showMean;

	if (showMean) {
		vegaEmbed('#distanceVis', distance_by_day_mean_spec, { actions: false });
		document.getElementById("aggregate").innerText = "Show all activities";
	} else {
		vegaEmbed('#distanceVis', distance_by_day_spec, { actions: false });
		document.getElementById("aggregate").innerText = "Show means";
	}
	});

}

//Wait for the DOM to load
document.addEventListener('DOMContentLoaded', function (event) {
	loadSavedRunkeeperTweets().then(parseTweets);
});
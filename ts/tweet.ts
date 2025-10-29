class Tweet {
	private text:string;
	time:Date;
    private day: string | number;

	constructor(tweet_text:string, tweet_time:string) {
        this.text = tweet_text;
		this.time = new Date(tweet_time);//, "ddd MMM D HH:mm:ss Z YYYY"
        this.day = this.time.getDay();
        switch (this.day){
            case 1:
                this.day = "Monday"
                break;
            case 2:
                this.day = "Tuesday"
                break;
            case 3:
                this.day = "Wednesday"
                break;
            case 4:
                this.day = "Thursday"
                break;
            case 5:
                this.day = "Friday"
                break;
            case 6:
                this.day = "Saturday"
                break;
            case 0:
                this.day = "Sunday"
                break;
        }
	}
	//returns either 'live_event', 'achievement', 'completed_event', or 'miscellaneous'
    get source():string {
        //TODO: identify whether the source is a live event, an achievement, a completed event, or miscellaneous.
        if (this.text.startsWith("Just completed") || this.text.startsWith("Just posted")){
            return "completed_event";
        } else if (this.text.includes("right now") || this.text.includes("Live")){
            return "live_event";
        } else if (this.text.startsWith("Achieved") || this.text.includes("New Record")){
            return "achievement";
        } else {
            return "miscellaneous";
        }
    }

    //returns a boolean, whether the text includes any content written by the person tweeting.
    get written():boolean {
        //TODO: identify whether the tweet is written
        let stripped = this.text;

        stripped = stripped.substring(0, stripped.indexOf("http"));
        stripped = stripped.replace("@RunKeeper", "").trim();
        return stripped.includes(" - ");
    }

    get writtenText():string {
         if (!this.written) {
            return "";
        }
        let stripped = this.text;
        let dashIndex;

        stripped = stripped.substring(0, stripped.indexOf("http"));
        stripped = stripped.replace("@RunKeeper", "").trim();
        dashIndex = stripped.indexOf(" - ");
        stripped = stripped.substring(dashIndex + 3).trim();
        //TODO: parse the written text from the tweet
        return stripped;
    }

    get activityType():string {
        if (this.source != 'completed_event') {
            return "unknown";
        }
        //TODO: parse the activity type from the text of the tweet
        let lowerCaseText = this.text.toLowerCase();

        if (lowerCaseText.includes(" run ") || lowerCaseText.includes("jog")){
            return "running";
        }
        if (lowerCaseText.includes("bike") || lowerCaseText.includes("cycling") || lowerCaseText.includes("ride")){
            return "biking";
        }
        if (lowerCaseText.includes("walk")){
            return "walking";
        }
        if (lowerCaseText.includes("hike")){
            return "hiking";
        }
        if (lowerCaseText.includes("swim")){
            return "swimming";
        }
        if (lowerCaseText.includes("ski")){
            return "skiing";
        }
        if (lowerCaseText.includes("workout") ||  lowerCaseText.includes("training") || lowerCaseText.includes("gym")){
            return "workout";
        }
        if (lowerCaseText.includes("row")){
            return "rowing";
        }
        return "miscellaneous"
    }

    get distance():number {
        if (this.source != 'completed_event') {
            return 0;
        }

        let stripped = this.text;
        let measurementIndex;
        let distance = 0;

        if (stripped.includes(" km")) {
            measurementIndex = stripped.indexOf(" km");
            let start = measurementIndex - 1;
            while (start >= 0 && stripped[start] !== " ") {
                start--;
            }
            start++;
            distance = parseFloat(stripped.substring(start, measurementIndex).trim());
            distance = distance / 1.609;
        }

        else if (stripped.includes(" mi")) {
            measurementIndex = stripped.indexOf(" mi");
            let start = measurementIndex - 1;
            while (start >= 0 && stripped[start] !== " ") {
                start--;
            }
            start++;
            distance = parseFloat(stripped.substring(start, measurementIndex).trim());
        }

        return distance;
    }

    getHTMLTableRow(rowNumber:number):string {
        //TODO: return a table row which summarizes the tweet with a clickable link to the RunKeeper activity
            const linkStart = this.text.indexOf("http");
            let link = "";
            let displayText = this.text;

            if (linkStart !== -1) {
                link = this.text.substring(linkStart).trim();
                displayText = this.text.substring(0, linkStart) +
                    `<a href='${link}' target='_blank'>${link}</a>`;
            }

            const row = `
                <tr>
                    <td>${rowNumber + 1}</td>
                    <td>${this.activityType}</td>
                    <td>${displayText}</td>
                </tr>`;

            return row;
    }
}
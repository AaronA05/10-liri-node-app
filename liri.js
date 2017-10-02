//============Set the Required calls, along with user access========

//Node Request 
var request = require("request");

//Node Spotify 
var spotify = require("node-spotify-api");
var spotifyKeys = new spotify({
	id: "21b74791631d4f7cb24a100bea09212b",
	secret: "52f849ef58d141cb88bc0a975e2d5a91",
});

//Node Twitter, access stored in keys file
var twitterClient = require("./keys.js");

//Node FS
var fs = require("fs");

var newLine = "\n";

//Capture node line input for which command the user wants to execute (twitter, omdb, spotify, readfile)
var userCommand = process.argv[2];

//==============================Global Functions==================================

//Spotify function with the "string" argument being passed into the spotify search function
function spotifyFunction(string){
	//Spotify search function
	spotifyKeys.search({
		type: "track",
		//This is where string can be passed from the command line or the random.txt read file
		query: string },
		function(err, data){
			if(err){
				console.log(err);
			}
			//variable to access the first tracks object in the search data results
			var songData = data.tracks.items[0];
			//Commented out the full data of the song, used to access other pieces of song data later
			// console.log(songData);
			// console.log("================================");
			// console.log("================================");

			//Artist Name 
			console.log("Artist: " + songData.album.artists[0].name);
			//Song name
			console.log("Song: " + songData.name);
			//Song preview URL - if their is no preview URL let the user know, otherwise log the preview url
			if(songData.preview_url === "null"){
				console.log("Sorry no preview URL available");
			}else{
				console.log("Preview song: " + songData.preview_url);
			}
			//Album song was on
			console.log("Album: " + songData.album.name);

			//Write the music information to the log.txt file
			fs.appendFile("log.txt", "======================" + newLine +
				"===== MUSIC DATA =====" + newLine + 
				"======================" + newLine +
				"Artist: " + songData.album.artists[0].name + newLine +
				"Song: " + songData.name + newLine +
				"Preview song: " + songData.preview_url + newLine + 
				"Album: " + songData.album.name + newLine
				,"utf8", (err) =>{
				if(err) throw err;
				console.log("Song data added to file");
			});
		})
}

function omdbFunction(movieTitle){
	request("http://www.omdbapi.com/?apikey=40e9cece&t=" + movieTitle, function(error, response, body){
		if(error){
			console.log(err);
		}
		//Parse the body of the return to make it accessible for later information
		var movieInfo = JSON.parse(body);
		//Commented out function to see the full data for the movie info and access data later
		// console.log(movieInfo);
		// console.log("============================");
		// console.log("============================");
		console.log("Title: " + movieInfo.Title);
		console.log("Year: " + movieInfo.Year);//year
		console.log("IMDB Rating: " + movieInfo.Ratings[0].Value);//IMDB rating
		console.log("Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value);//Rotten tomatoes rating
		console.log("Country: " + movieInfo.Country);//country
		console.log("Language: " + movieInfo.Language);//language
		console.log("Plot: " + movieInfo.Plot);//plot
		console.log("Actors: " + movieInfo.Actors);//actors

		//Write the movie information to the log.txt file
		fs.appendFile("log.txt", "======================" + newLine +
			"===== MOVIE DATA =====" + newLine + 
			"======================" + newLine + 
			"Title: " + movieInfo.Title + newLine +
			"Year: " + movieInfo.Year + newLine +
			"IMDB Rating: " + movieInfo.Ratings[0].Value + newLine +
			"Rotten Tomatoes Rating: " + movieInfo.Ratings[1].Value + newLine +
			"Country: " + movieInfo.Country + newLine +
			"Langauge: " + movieInfo.Language + newLine +
			"Plot: " + movieInfo.Plot + newLine +
			"Actors: " + movieInfo.Actors + newLine
			 , "utf8", (err) => {
			if (err) throw err;
			console.log("Movie data added to file");
		} );
	})
}

//===============TWITTER===================

if (userCommand === "my-tweets"){
	//set my screen name as the username argument to pass to the .get function
	var userName = {screen_name: "code_hw"};
	// .get argument to find the twitter user's tweets
	twitterClient.get("statuses/user_timeline", userName, function(error, tweets, response){
		if(error){
			console.log(error);
		}
		//loop through the latest 20 tweets of user and log them to console
		for(var i = 0; i <= 20 ; i++){
			console.log(tweets[i].created_at);
			console.log(tweets[i].text);
		}
		
		
	});

}

//===================SPOTIFY=================
// Client ID - 21b74791631d4f7cb24a100bea09212b
// Client Secret - 52f849ef58d141cb88bc0a975e2d5a91

if(userCommand === "spotify-this-song"){
	var string = " ";
	if(process.argv[3] === undefined){
		string = "The Sign";
	}else{
		//Empty array to hold the user entries in node 
		var queryArr = [];
		//Loop through the user entries and push to array
		for(var k = 3; k < process.argv.length; k++){
			var query = process.argv[k];
			queryArr.push(query); 
		}
		//Take all elements of the array and join them into a string to pass to spotify function as the string search
		string = queryArr.join(" ");
	}
	spotifyFunction(string);
}

//==================OMDB==================

var movieKey = "40e9cece";

if(userCommand === "movie-this"){
	//Array to hold all user input from command line
	var movieArray = [];
	for(var j = 3; j < process.argv.length; j++){
		movieArray.push(process.argv[j]);
	}

	//Take all items from array and join them with a "+" to properly pass into API Call
	var movieTitle = movieArray.join("+");

	//Pass the full move title into the OMDB function
	omdbFunction(movieTitle);

}	

if(userCommand === "do-what-it-says"){
	//Reads the data from the random.txt file
	fs.readFile("random.txt", "utf8", function(error, data){
		if(error){
			console.log(error);
		}

		//This splits the text from the random.txt file into two separate pieces
		//We will use the two indexes to pass to the argument and call a function
		var command = data.split(",");
		//First index in array is the command, second index is the string value for the spotify function
		if(command[0] === "spotify-this-song"){
			spotifyFunction(command[1]);
		}
		//First index in array is the command, second index is the string value for the omdb function
		if(command[0] === "movie-this"){
			omdbFunction(command[1]);
		}
		
	})
}

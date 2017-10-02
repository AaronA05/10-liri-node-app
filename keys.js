console.log('this is loaded');

var twitter = require("twitter");

var twitterKeys = new twitter ({
  consumer_key: 'UCwtADoNbnk0n3FAEX2MaGdGA',
  consumer_secret: '75VRup4QBSqehFAT7nlUIgZ6gQfUfBvdlWCF7gQBpVkdJkU832',
  access_token_key: '912847269539516417-RrWNhf7npX0Xnt6ASu2aHkpusZNqCu9',
  access_token_secret: 'UXifWSQ3EngLxcCtjgXyzUhLRiVkIYyEayXlweL7LuvTH',
});


module.exports = twitterKeys;

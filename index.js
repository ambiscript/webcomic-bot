const Discord = require('discord.js'),
      comicHandler = require('comicscraper'),
      CronJob = require('cron').CronJob,
      http = require('http');

const client = new Discord.Client(),
      config = require('./config.json');

comicHandler.initialize({
      mongoAuth: config.mongoAuth
});

http.createServer((req, res) => {
      res.writeHead(200, {"Content-Type":
      "text/html"});
      res.write("Webcomic-Bot online.");
      res.end();
}).listen(process.env.PORT || 8080);

setInterval(function() {
      http.get("http://webcomic-bot.herokuapp.com");
}, 300000); // every 5 minutes (300000)

client.on("ready", () => {
      const job = new CronJob({
            cronTime: '00 00 */6 * * 1-5/2', 
            onTick: function() {
                  /*
                  * Runs every other weekday (Monday, Wednesday, Friday)
                  * at 12:00:00 PM (Noon). It does not run on Saturday,
                  * Tuesday, Thursday, or Sunday.
                  */
                  config.comics.forEach(comicURL => {
                        console.log(`Parsing comic from ${comicURL}...`);
                        comicHandler.parse(comicURL).then(comic => {
                              console.log('Comic parsed!');
                              console.log('Starting update...');
                              comicHandler.update(comic).then(() => {
                                    console.log('Update complete!');
                                    const embed = new Discord.RichEmbed()
                                    .setTitle(comic.title)
                                    .setURL(comicURL)
                                    .setImage(comic.url)
                                    .setFooter(comic.subtitle);
      
                                    client.channels.get(config.channels[comic.title].send({embed}));
                              }).catch(err => {
                                    console.log('Update failed.');
                                    console.log(err);
                              });
                        }).catch(err => {
                              console.log('Unable to parse comic.');
                              console.log(err);
                        });
                  });
            },
            start: true,
            timeZone: 'America/New_York'
      });
});

client.login(config.discordAuth);
const Discord = require('discord.js'),
      comicHandler = require('comicscraper'),
      CronJob = require('cron').CronJob;

const client = new Discord.Client(),
      config = require('./config.json');

comicHandler.initialize({
      mongoAuth: config.mongoAuth
});

http.createServer((req, res) => {

}).listen(process.env.PORT || 8080);

setInterval(function() {
      http.get("http://webcomic-bot.herokuapp.com");
  }, 300000); // every 5 minutes (300000)

const job = new CronJob({
      cronTime: '00 00 12 * * 1, 3, 5', 
      onTick: function() {
            /*
            * Runs every other (Monday, Wednesday, Friday)
            * at 12:00:00 PM (Noon). It does not run on Saturday,
            * Tuesday, Thursday, or Sunday.
            */
            config.comics.forEach(comicURL => {
                  comicHandler.fetch(comicURL).then(comic => {
                        comicHandler.update(comic).then(() => {
                              const embed = new Discord.RichEmbed()
                              .setTitle(comic.title)
                              .setURL(comicURL)
                              .setImage(comic.url)
                              .setFooter(comic.subtitle);

                              client.channels.get(config.channels[comit.title].send({embed}));
                        }).catch(err => {
                              console.log(err);
                        });
                  }).catch(err => {
                        console.log(err);
                  });
            });
      },
      start: true,
      timeZone: 'America/New_York'
});

client.login(config.discordAuth);
const Discord = require('discord.js'),
      comicHandler = require('comicscraper'),
      CronJob = require('cron').CronJob;

const client = new Discord.Client(),
      config = require('./config.json');

comicHandler.initialize({
      mongoAuth: config.mongoAuth
});

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
                              .setImage(comic.url)
                              .setFooter(comic.subtitle);
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
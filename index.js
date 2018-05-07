const job = new CronJob({
      cronTime: '00 00 12 * * 1-5/2', 
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
const commando = require('discord.js-commando');

module.exports = class SendAnnouncement extends commando.Command {
	constructor(client) {
		super(client, {
			name: 'sendannouncement',
			aliases: ['senda', 'sendann'],
			group: 'jeux-gratuits',
			memberName: 'sendannouncement',
			description: 'Commande utilisée pour envoyer le message (Owner Only)',
			examples: ['sendannouncement Hello World!'],
			guarded: true,
			hidden: true,
			ownerOnly: true,

			args: [
				{
					key: 'message',
					label: 'text',
					prompt: 'Quel message envoyer ?',
					infinite: true,
					type: 'string',
				},
			],
		});
	}

	async run(msg, args) {
		const mes = args.message;
		this.client.guilds.map((__snflk, guild) => {
			if (guild.available) {
				const chan = this.client.channels.get(this.client.provider.get(guild, 'freeChannel', guild.systemChannelID));
				try {
					chan.send(mes);
					console.log(`Message envoyé avec succès à "${guild}"`);
				} catch(e) {
					msg.channel.send(`\`${e}\` pour le serveur ${guild}`);
					console.log(e);
				}
			} else {
				console.log(`Discord "${guild}" est indisponible`);
			}
		});
		return msg.channel.send('Message envoyé à tous les serveurs !');
	}
};

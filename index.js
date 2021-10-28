// Require the necessary discord.js classes
const { Client, Intents } = require('discord.js');
const { joinVoiceChannel, getVoiceConnection, createAudioPlayer, createAudioResource, NoSubscriberBehavior } = require('@discordjs/voice');
const { AudioPlayerStatus } = require('@discordjs/voice');
const { clientId, guildId, token } = require('./auth.json');
const play  = require('play-dl');

// Create a new client instance
const client = new Client({ intents : [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES, Intents.FLAGS.DIRECT_MESSAGES] , partials : ['CHANNEL', 'MESSAGE']})
const player = createAudioPlayer({
	behaviors: {
			noSubscriber: NoSubscriberBehavior.Play
	}
})

// When the client is ready, run this code (only once)
client.once('ready', () => {
	console.log('Ready!');
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;

	const { commandName } = interaction;

	if (commandName === 'ping') 
	{
		await interaction.reply('Pong!');
	} 
	else if (commandName === 'server') 
	{
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	} 
	else if (commandName === 'user') 
	{
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}\nYour channel: ${interaction.member.voice.name}`);
	}

});

client.on('messageCreate', async message => {
	if (message.content.startsWith('!play'))
	{
		const connection = joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

		let args = message.content.split('play ')[1]
		let yt_info = await play.search(args, { limit : 1 })
		let stream = await play.stream(yt_info[0].url)
		let resource = createAudioResource(stream.stream, {
			inputType : stream.type
		})

		//Play resource
		player.play(resource)

		connection.subscribe(player);

		await message.reply('not-groovy has started playing!');
	}
	else if (message.content.startsWith('/play'))
	{
		const connection = joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

		let args = message.content.split('play ')[1]
		let yt_info = await play.search(args, { limit : 1 })
		let stream = await play.stream(yt_info[0].url)
		let resource = createAudioResource(stream.stream, {
			inputType : stream.type
		})

		//Play resource
		player.play(resource)

		connection.subscribe(player);

		await message.reply('not-groovy has started playing!');
	}
	else if (message.content.startsWith('-play'))
	{
		const connection = joinVoiceChannel({
			channelId: message.member.voice.channel.id,
			guildId: message.guild.id,
			adapterCreator: message.guild.voiceAdapterCreator,
		});

		let args = message.content.split('play ')[1]
		let yt_info = await play.search(args, { limit : 1 })
		let stream = await play.stream(yt_info[0].url)
		let resource = createAudioResource(stream.stream, {
			inputType : stream.type
		})

		//Play resource
		player.play(resource)

		connection.subscribe(player);

		await message.reply('not-groovy has started playing!');
	}
	else if (message.content.startsWith('-stop') || message.content.startsWith('/stop') || message.content.startsWith('!stop'))
	{
		player.stop();
	}
	else if (message.content.startsWith('-disconnect') || message.content.startsWith('/disconnect') || message.content.startsWith('!disconnect'))
	{
		let connection = getVoiceConnection(message.guild.id);
		connection.destroy();
	}

})


// Login to Discord with your client's token
client.login(token);
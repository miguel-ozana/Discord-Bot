const { REST, Routes} = require('discord.js');
const { CLIENT_ID, GUILD_ID, TOKEN } = require('./src/json/config.json');
const fs = require('node:fs');


const commands = [];
// Grab all the command files from the commands directory you created earlier
const commandFiles = fs.readdirSync('./src/cmd').filter(file => file.endsWith('.js'));

// Grab the SlashCommandBuilder#toJSON() output for each command's data for deployment
for (const file of commandFiles){
	const command = require(`./src/cmd/${file}`);
	commands.push(command.data.toJSON());
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: '10' }).setToken(TOKEN);

// deploy cmd
(async() => {
	try {
		console.log(`Started refreshing ${commands.length} application (/) commands.`);

		// put method to fully refresh all cmd in the guild with the current set
		const data = await rest.put(
			Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
			{ body: commands },
		);

		console.log(`Sucessfully reloaded ${data.length} application (/) commands.`);
	} catch (error){
		console.log(error);
    }
}) ();
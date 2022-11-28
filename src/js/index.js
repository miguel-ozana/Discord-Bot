// Require the necessary discord.js classes
const { 
    Client, 
    Events, 
    GatewayIntentBits,
    Collection,
 } = require('discord.js');


const { TOKEN } = require('../json/config.json');

const fs = require('node:fs');
const path = require('node:path');

// Create a new client instace
const client = new Client({ intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.DirectMessages,
] });


client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`No command matching ${interaction.commandName} was found.`);
		return;
	}

	try {
		await command.execute(interaction);
	} catch (error) {
		console.error(`Error executing ${interaction.commandName}`);
		console.error(error);
	}
});


// Path and fs
client.commands = new Collection();

const commandsPath = path.join(__dirname, '../cmd');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles){
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);

	if('data' in command && 'execute' in command){
		client.commands.set(command.data.name, command);
	} else {
		console.log(`[WARNING] the command at ${filePath} is missing a required "data" or "execute" property`);
	}
}


// When client ready, run this code (only oce)
// Use 'c' for the event parameter to keep it separete from the already defined 'client'
client.once(Events.ClientReady, c =>{
    console.log(`Hello! Login as: ${c.user.tag}`);
});

// Main function
async function main(){
    client.login(TOKEN);
}

main();
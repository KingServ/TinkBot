import { Command } from "../classes/commands/command";
import { Tinkbot } from "../classes/tinkbot";
import { Message, Collection } from "discord.js";

export class FindAllCommands extends Command {
    constructor(TinkbotClient: Tinkbot) {
        super(TinkbotClient, {
            name: 'findallcommands',
            desc: 'Affiche une liste de toutes les commandes',
            ownerOnly: true,
            hidden: true,
        });
    }

    async run(msg: Message): Promise<Message|Message[]> {
        const allCommands: string[] = [];
        const commands: Collection<string, Command> = this.TinkbotClient.registry.commands;
        commands.forEach((command) => {
            allCommands.push(command.name);
        });

        let response = await msg.channel.send(`Fetching commands... (0/${commands.size})`);

        while (allCommands.length < commands.size) {
            response = await response.edit(`Fetching commands... (${allCommands.length}/${commands.size})`)
        }

        let resultString: string = allCommands.toString();

        return response.edit('__Commandes:__\n[' + resultString + ']');
    }
}

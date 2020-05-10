import { Message, GuildChannel } from 'discord.js';
import { Command } from '../classes/commands/command';
import { Tinkbot } from '../classes/tinkbot';
import { ArgumentCollectorResult } from '../classes/commands/arguments/collector';

export class TestCommand extends Command {
    constructor(TinkbotClient: Tinkbot) {
        super(TinkbotClient, {
            name: 'test',
            desc: 'Définit le canal utilisé par Tinkbot sur le serveur',
            ownerOnly: false,
            hidden: false,

            args: [
            ],
        });
    }

    async run(msg: Message): Promise<Message|Message[]> {
        return msg.reply('Hello World!');
    }
}

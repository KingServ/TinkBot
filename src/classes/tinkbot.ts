'use strict';
import * as Discord from 'discord.js';
import * as path from 'path';
import * as fs from 'fs';
import { Command } from './commands/command';
import { ArgumentType } from './commands/arguments/types/type';
import { Registry } from './registry';
import { ArgumentCollector } from './commands/arguments/collector';

export type TinkbotOptions = {
    owners: readonly string[];
    prefix: string;
    token: string;
    inDev: boolean;
    clientOptions?: Discord.ClientOptions;
};


export class Tinkbot {
    private static _INSTANCE: Tinkbot = null;
    private readonly _client: Discord.Client;
    private _prefix: string;
    private readonly _token: string;
    private readonly _inDev: boolean;
    public readonly _owners: ReadonlyArray<string>;
    public registry: Registry;

    private constructor(options: TinkbotOptions) {
        Tinkbot.validateOptions(options);

        this._client = new Discord.Client(options.clientOptions);
        this._token = options.token;
        this._inDev = options.inDev;
        this._owners = options.owners;
        this._prefix = options.prefix;
        this.registry = new Registry(this);
    }

    public static createInstance(options: TinkbotOptions): Tinkbot {
        if (Tinkbot._INSTANCE == null) {
            Tinkbot._INSTANCE = new Tinkbot(options);
        }
        return this.getInstance();
    }

    public static getInstance(): Tinkbot {
        if (!Tinkbot._INSTANCE == null) throw new Error('Tinkbot has not yet been instanciated!');
        return Tinkbot._INSTANCE;
    }

    get owners(): readonly Discord.User[] {
        const owners = [];
        for (const owner of this._owners) {
            owners.push(this._client.users.cache.get(owner));
        }
        return owners;
    }

    public isOwner(id: Discord.Snowflake): boolean {
        return this._owners.includes(id);
    }

    public setTimeout(fn: (...args: any[]) => void, delay: number, ...args: any[]): NodeJS.Timer {
        return this._client.setTimeout(fn, delay, args);
    }

    public listen(): Promise<string> {
        this._client.on('ready', () => {
            console.log(`TinkBot is ready! Listening as ${this._client.user.tag}...`);
            if (!this._inDev) {
                this.updateGuildsCount();
            }
        });

        this._client.on('message', async (msg: Discord.Message) => {
            if (msg.author.bot || !msg.content.startsWith(this._prefix)) return;

            // if (msg.guild && msg.guild.available && this.inDev) {
            //     let chan: Discord.GuildChannel = msg.guild.channels.cache.get(msg.channel.id);
            //     console.log(`${msg.author.tag} in #${chan.name} (${msg.guild}): "${msg.content}"`);
            // }

            const args: Array<string> = msg.content.slice(this._prefix.length).split(/ +/);
            const commandName: string = args.shift().toLowerCase();
            let command: Command = null;

            try {
                command = this.registry.findCommand(commandName);
            } catch(error) {
                console.error(error);
                return msg.reply('cette commande n\'existe pas !');
            }

            if (command) {
                try {
                    if (command.argsCollector) {
                        command.argsCollector.obtain(msg, args).then(result => {
                            command.run(msg, result);
                        });
                    } else {
                        command.run(msg, null);
                    }
                } catch(error) {
                    console.error(error);
                    return msg.reply('une erreur est survenue lors de l\'exécution de la commande !');
                }
            }
        });

        this._client.on('guildCreate', (guild: Discord.Guild) => {
            console.log(`Joined guild "${guild.name}" (${guild.id})`);

            //TODO: Cook up some welcome message explaining how to use the bot

            this.updateGuildsCount();
        });

        this._client.on('guildDelete', (guild: Discord.Guild) => {
            console.log(`Left guild "${guild.name}" (${guild.id})`);
        })

        this.registry.registerCommandsIn(path.join(__dirname, '..', 'commands'))
                .registerTypesIn(path.join(__dirname, '..', 'types'));

        return this._client.login(this._token);
    }

    async handleMessage(msg: Discord.Message): Promise<void> {
        
    }

    private updateGuildsCount(): void {
        this._client.user.setPresence({ activity: {
            name: `les jeux gratuits pour ${this._client.guilds.cache.size} serveurs`,
            type: 'WATCHING',
        }});
    }

    private static validateOptions(options: TinkbotOptions): void {
        if (!options) throw new Error('Missing information to launch the bot!');
        if (!options.token) throw new Error('You must provide a token for the bot to launch!');
        
    }

}

import { ArgumentType } from "../classes/commands/arguments/types/type";
import { Tinkbot } from "../classes/tinkbot";
import { Argument } from "../classes/commands/arguments/argument";
import { Message } from "discord.js";

export class StringArgumentType extends ArgumentType {
    
    constructor(TinkbotClient: Tinkbot) {
        super(TinkbotClient, 'string');
    }

    validate(val: string, msg: Message, arg: Argument): string | boolean | Promise<string | boolean> {
        return true;
    }
    
    parse(val: string, msg: Message, arg: Argument) {
        return val
    }

}

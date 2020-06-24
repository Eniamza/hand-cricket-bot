import { prefix } from '../../config.json'
import { Client, MessageEmbed } from 'discord.js';

/**
 * @description Set up a command listener.
 * @param {Client} client The main discord.js client object.
 * @param {String} command Command as a string (without prefix).
 * @param {String|MessageEmbed} output A direct string or embed output to be sent in the same channel.
 * @param {function} cb A callback that is fired when the command is run.
 */
function onCommand(client: Client, command: string, output:  (string | MessageEmbed), cb?: Function) {
  client.on('message', msg => {
    if (msg.content.toLowerCase() === `${prefix}${command}`) {
      msg.channel.send(output);
      if (cb) cb(msg);
    }
  })
}

export default onCommand;
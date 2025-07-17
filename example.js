import { Client, GatewayIntentBits, Partials } from 'discord.js'
import axios from 'axios'
import uploadTop4Top from './top4top.js'

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Attachment
  ]
})

client.once('ready', () => {
  console.log(`Bot ready as ${client.user.tag}`)
})

client.on('messageCreate', async (message) => {
  if (message.author.bot) return
  if (!message.content.startsWith('!up')) return
  if (!message.attachments.size) return message.reply('Please attach the file along with the command `!up`.')
  try {
    const attachment = message.attachments.first()
    const data = await axios.get(attachment.url, { responseType: 'arraybuffer' })
    const url = await uploadTop4Top(Buffer.from(data.data), attachment.name)
    await message.reply(`Successfully uploaded to Top4Top:\n${url}`)
  } catch (error) {
    console.error('Uploads unsuccessful:', error)
    await message.reply(`The upload process was unsuccessful: ${error.message}`)
  }
})

client.login('Aarmaaa28')

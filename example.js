import { Client, GatewayIntentBits, Partials, Events } from 'discord.js'
import { uploadTop4Top } from './top4top.js'
import axios from 'axios'

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

client.once(Events.ClientReady, () => {
  console.log(`Bot ready as ${client.user.tag}`)
})

client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.content.startsWith('!up')) return

  if (!message.attachments.size) {
    return message.reply('Please attach the file along with the command `!up`.')
  }

  try {
    const attachment = message.attachments.first()
    const response = await axios.get(attachment.url, { responseType: 'arraybuffer' })

    const url = await uploadTop4Top(Buffer.from(response.data), attachment.name)
    await message.reply(`Successfully uploaded to Top4Top:\n${url}`)
  } catch (error) {
    console.error('Uploads unsuccessful:', error)
    await message.reply(`The upload process was unsuccessful: ${error.message}`)
  }
})

client.login('Aarmaaa28')
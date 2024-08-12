require("dotenv").config()
const { Bot, GrammyError, HttpError } = require("grammy")
const { hydrate } = require("@grammyjs/hydrate")

const bot = new Bot(process.env.HTTP_API_KEY)
bot.use(hydrate())

bot.api.setMyCommands([
  { command: "start", description: "Запуск бота" },
  { command: "help", description: "Помощь" },
])

bot.command("start", async (ctx) => {
  await ctx.reply("Works!")
})

bot.command("help", async (ctx) => {
  await ctx.reply("Для запуска бота выполните команду /start")
})

bot.hears("ping", async (ctx) => {
  // `reply` is an alias for `sendMessage` in the same chat (see next section).
  await ctx.reply("pong", {
    // `reply_parameters` specifies the actual reply feature.
    reply_parameters: { message_id: ctx.msg.message_id },
  })
})

bot.on(":text", async (ctx) => {
  const statusMessage = await ctx.reply("Thinking...")
  setTimeout(async () => {
    await ctx.api.editMessageText(
      ctx.chat.id,
      statusMessage.message_id,
      `Вы ввели <blockquote>${ctx.msg.text}</blockquote>`,
      {
        parse_mode: "HTML",
      }
    )
    // await ctx.reply(`Вы ввели <blockquote>${ctx.msg.text}</blockquote>`, {
    //   parse_mode: "HTML",
    // })
  }, 3000)
})

bot.catch((err) => {
  const ctx = err.ctx
  console.error(`Error while handling update ${ctx.update.update_id}:`)
  const e = err.error
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description)
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e)
  } else {
    console.error("Unknown error:", e)
  }
})

bot.start()

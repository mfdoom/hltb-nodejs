import tmi from "tmi.js"
import hltb from "howlongtobeat"
let hltbService = new hltb.HowLongToBeatService()
var HLTBScriptExecuting = false //для cooldown сообщений

//TMI
const client = new tmi.Client({
  options: { debug: true },
  connection: {
    secure: true,
    reconnect: true,
  },
  identity: {
    username: "user",
    password: "oauth:password",
  },
  channels: ["your_channels"],
})
client.connect()

client.on("message", (channel, tags, message, self) => {
  if (self) {
    return
  }

  //HLTB
  const argsHLTB = message.slice(1).split(" ")
  const commandHLTB = argsHLTB.shift().toLowerCase()
  if ((commandHLTB === "hltb") & !HLTBScriptExecuting) {
    const argstb = message.slice(1).split(" ")
    argstb.shift()
    const hltbText = argstb.join(" ")
    hltbService
      .search(hltbText)
      .then((result) => {
        //async поиск
        const res1 = result[0].gameplayMain
        const res2 = result[0].gameplayMainExtra
        if (res2 === 0) {
          HLTBScriptExecuting = true
          client.say(channel, `Main: ${res1} ч`)
          setTimeout(function () {
            HLTBScriptExecuting = false
          }, 10000)
        } else {
          client.say(channel, `Main: ${res1} ч, Extra: ${res2} ч`)
          HLTBScriptExecuting = true
          setTimeout(function () {
            HLTBScriptExecuting = false
          }, 10000)
        }
      })
      .catch((error) => {
        console.error("Error", error)
      })
  }
})

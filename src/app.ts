/* eslint-disable no-console */
import './utils/env';
import { App, LogLevel } from '@slack/bolt';
import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { castSpell } from './actions';
import { findOrOnboardUser } from './utils/users';

export const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  appToken: process.env.SLACK_APP_TOKEN,
  socketMode: true,
  logLevel: LogLevel.DEBUG
});

app.use(async ({ next }) => {
  await next();
});


app.message(/^.*:hex:.*$/, async ({ message, context, say }) => {
  // RegExp matches are inside of context.matches
  const reason = context.matches[0];
  if (!message.subtype) {
    console.log(message.blocks)
    const caster = await findOrOnboardUser(message.user)
    const receiverRegex = new RegExp('<(.*?)>', 'g')
    const receivers = message.text?.match(receiverRegex)
    if (!receivers) {
      //If no recievers were tagged
      setTimeout(async () => {
        await app.client.chat.postEphemeral({
          "user": message.user,
          "channel": message.channel,
          "text": "You forgot to tag a user to cast your spell on!",
          "reply_broadcast": false
        })
      }, 100);
      console.log('sent no receiver warning')
      return
    }
    if (caster && receivers && receivers.length >= 1) {
      //Iterate over receivers and cast spells on them!
      receivers.forEach(async (receiver) => {
        const receiverUser = await findOrOnboardUser(receiver);
        console.log(receiverUser)
        if (receiverUser.id == caster.id) {
          await app.client.chat.postEphemeral({
            "user": message.user,
            "channel": message.channel,
            "text": "Careful there, can't be going around casting hexes on yourself!",
            "reply_broadcast": false
          })
          console.log('sent self-cast warning')
          return
        }
        if (receiverUser) {
          const spellcast = await castSpell(caster, receiverUser, 'hex', reason)
          console.log('spell cast', spellcast)
          if (spellcast.status == 'limit') {
            await app.client.chat.postEphemeral({
              "user": message.user,
              "channel": message.channel,
              "text": "Spell not cast, you are all out of spells!",
              "reply_broadcast": false
            })
            console.log('sent limit warning')
            return
          }
          if (spellcast.spell) {
            await say(`Congratulations ${receiver}, you've been blessed by ${spellcast.spell.name}, ${spellcast.spell.description}! ${spellcast.spell.effects}. Enjoy!`)
          }
        } else {
          throw new Error("No receiver user found in DB")
        }
      })
    }
  }
});

app.event('app_home_opened', async ({ event, client, logger }) => {
  try {
    console.log(event)
    const currentUser = await findOrOnboardUser(event.user)
    console.log(currentUser)

    const result = await client.views.publish({
      user_id: event.user,
      view: {
        "type": "home",
        "blocks": [
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "*Welcome home, <@" + event.user + "> :house:*."
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "your current balance is " + currentUser?.currentBalance
            }
          },
          {
            "type": "section",
            "text": {
              "type": "mrkdwn",
              "text": "Learn how home tabs can be more useful and interactive <https://api.slack.com/surfaces/tabs/using|*in the documentation*>."
            }
          }
        ]
      }
    });

    logger.info(result);
  }
  catch (error) {
    logger.error(error);
  }
});


(async () => {
  // Start your app
  AppDataSource.initialize().then(async () => {
    console.log('database connection spinning up')
  }).catch(error => console.log(error))

  await app.start(Number(process.env.PORT) || 3000);

  console.log('Magick bot is running!');
})();


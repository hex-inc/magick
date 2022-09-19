"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// Require the Bolt package (github.com/slackapi/bolt)
const { App } = require("@slack/bolt");
require('dotenv').config();
const app = new App({
    token: process.env.SLACK_BOT_TOKEN,
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    appToken: process.env.SLACK_APP_TOKEN,
    socketMode: true,
});
// All the room in the world for your code
app.message(/^.*:hex:.*$/, ({ context, say }) => __awaiter(void 0, void 0, void 0, function* () {
    // RegExp matches are inside of context.matches
    const greeting = context.matches[0];
    yield say(`${greeting}, how are you?`);
}));
app.message(/^.*:charm:.*$/, ({ context, say }) => __awaiter(void 0, void 0, void 0, function* () {
    // RegExp matches are inside of context.matches
    const greeting = context.matches[0];
    yield say(`${greeting}, how a re you?`);
}));
(() => __awaiter(void 0, void 0, void 0, function* () {
    // Start your app
    yield app.start(process.env.PORT || 3000);
    console.log('⚡️ Bolt app is running!');
}))();

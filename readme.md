# MAGICK BOT

Whenever you cast a spell by sending a message with `:hex:` in it and mention another user, this slackbot kicks into gear and digs up a spell from the database, casts it at the user on the other end of the message, and sends a message about it. It also logs a record of the transaction for a leaderboard / analytics.


## stuff
- all the package stuff should be installable by running `yarn` from the project dir
- this requires postgresql as a db, you can `brew update && brew install postgresql` to install it. You'll want to configure the db per the `data-source.ts` spec, this is a good tut on how to do it [link](https://gist.github.com/phortuin/2fe698b6c741fd84357cec84219c6667)
- I use postico to mess with the postgres db
- once you fire up the app with `yarn start`, it should connect to your local slack workspace of the magick bot testing workspace via websocket and.... just work!
- it uses nodemon to hot reload
- it uses typeorm to manage the db. if you have hot reloading on this means you can accidentally make changes to the db.
- I don't know how to seed data into the db so I just made two spells manually, using postico.
1	Frog Brain	A rare and potent spell of dubious origin. ribbit.	Your brain is transformed into several frogs, harnessing their joint processing power to keep your standard functions working.	hex	FALSE
2	Sunny day	A gentle calm washes over you and the sun peeks out from behind the clouds. Everything is going to be alright	All spells will have positive effect for the duration of this effect.	charm	TRUE
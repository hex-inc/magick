import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Spell } from "./entity/Spell"
import { SpellCast } from "./entity/CastSpell"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: "localhost",
    port: 5432,
    username: "hexed",
    password: "",
    database: "magick",
    synchronize: true,
    logging: false,
    entities: [User, Spell, SpellCast],
    migrations: [],
    subscribers: [],
})

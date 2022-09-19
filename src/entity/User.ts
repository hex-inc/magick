import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { SpellCast } from "./CastSpell"

@Entity()
export class User {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    slackId: string

    @Column()
    username: string

    @Column()
    currentBalance: number

    @OneToMany(() => SpellCast, (spellcast) => spellcast.caster)
    spellsCast: SpellCast[]

    @OneToMany(() => SpellCast, (spellcast) => spellcast.receiver)
    spellsReceived: SpellCast[]

}

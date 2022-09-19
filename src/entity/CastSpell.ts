import {
    Entity, PrimaryGeneratedColumn, Column, ManyToOne
} from "typeorm"
import { User } from "./User"
import { Spell } from "./Spell"


@Entity()
export class SpellCast {

    @PrimaryGeneratedColumn()
    id: number

    @Column({ type: 'timestamptz', nullable: false, default: () => 'CURRENT_TIMESTAMP' })
    castTime: Date

    @Column()
    reason: string

    @ManyToOne(() => User, (user) => user.spellsCast)
    caster: User

    @ManyToOne(() => User, (user) => user.spellsReceived)
    receiver: User

    @ManyToOne(() => Spell, (spell) => spell.casts)
    spell: Spell
}

import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { SpellCast } from "./CastSpell"

export type spellType = 'charm' | 'hex';



@Entity()
export class Spell {

    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column("text")
    description: string

    @Column("text")
    effects: string

    @Column()
    type: spellType

    @Column()
    isPositive: boolean

    @OneToMany(() => SpellCast, (spellcast) => spellcast.spell)
    casts: Spell[]
}

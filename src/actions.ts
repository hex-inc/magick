import { AppDataSource } from "./data-source"
import { User } from "./entity/User"
import { SpellCast } from './entity/CastSpell';
import { Spell, spellType } from './entity/Spell';

interface SpellCastRecord {
    status: 'cast' | 'limit' | 'error'
    castRecord?: SpellCast
    spell?: Spell
}

export async function castSpell(caster: User, receiver: User, spellType: spellType, reason: string): Promise<SpellCastRecord> {
    const spellRepository = AppDataSource.getRepository(Spell)
    const spellCastRepository = AppDataSource.getRepository(SpellCast)
    const userRepository = AppDataSource.getRepository(User)

    //can user cast a spell?
    if (caster.currentBalance < 1) {
        console.log('caster hit their limit for spells')
        return { 'status': 'limit' }
    }

    const currentSpell = new SpellCast()
    currentSpell.caster = caster
    currentSpell.receiver = receiver
    currentSpell.reason = reason

    const potentialSpells = await spellRepository.findBy({ type: spellType })
    console.log(potentialSpells)
    console.log(potentialSpells[0])
    const spell = potentialSpells[Math.floor(Math.random() * potentialSpells.length)];
    currentSpell.spell = spell
    await spellCastRepository.save(currentSpell)
    //decrement casters spell balance
    caster.currentBalance -= 1
    await userRepository.save(caster)
    console.log("Spell has been cast!")
    return { 'status': 'cast', 'castRecord': currentSpell, 'spell': spell }
}
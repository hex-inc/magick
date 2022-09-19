import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { app } from '../app'



export async function findOrOnboardUser(userSlackId: string): Promise<User> {
    const userRegex = new RegExp('<@(.*?)>', 'g')
    const matches = userSlackId.match(userRegex)
    const userid = matches ? matches[1] : userSlackId //match 0 is the entire string
    const userRepository = AppDataSource.getRepository(User)
    const foundUser = await userRepository.findOneBy({
        slackId: userid,
    })
    if (foundUser) {
        return foundUser
    }
    const newUser = new User()
    newUser.slackId = userid
    newUser.currentBalance = 5
    console.log(userid)
    const userObject = await app.client.users.info({
        user: userid,
    });
    newUser.username = userObject.user?.name || '';

    const currentUser = await userRepository.save(newUser)
    console.log("User has been saved")
    return currentUser
}
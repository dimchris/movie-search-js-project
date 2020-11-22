import {
    User
} from "../model/user"

export class UserMockService {

    login(username, password) {
        return new Promise((resolve, reject) => {
            if (username === 'dimchris' && password === '123') {
                resolve(new User('dimchris', 'this_is_a_token'))
            }
            reject(error);
        })
    }
}
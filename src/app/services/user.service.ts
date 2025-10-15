import { UserModel } from "../models/user.model"

export class UserService {

    static getUsers(): UserModel[] {
        if (!localStorage.getItem('users'))
            localStorage.setItem('users', JSON.stringify([
                {
                    firstName: 'example',
                    lastName: 'user',
                    email: 'user@example.com',
                    phone: '+38163123123',
                    password: 'user123',
                    toyTypes: 'plisana igracka',
                    data: []
                }
            ]))
        return JSON.parse(localStorage.getItem('users')!)
    }

    static findUserByEmail(email: string) {

        const users: UserModel[] = this.getUsers()
        const exactUser = users.find(u => u.email === email)

        if (!exactUser)
            throw new Error('Korisnik nije pronadjen!')
        return exactUser
    }

    static login(email: string, password: string) {
        const user = this.findUserByEmail(email)

        if (user.password !== password) {
            throw new Error('Loša loznika ili email!')

        }

        localStorage.setItem('active', user.email)
    }

    static signup(payload: UserModel) {
        const users: UserModel[] = this.getUsers()
        users.push(payload)
        localStorage.setItem('users', JSON.stringify(users))
    }

    static getActiveUser() {
        const active = localStorage.getItem('active')
        if (!active)
            throw Error('Niste ulogovani')

        return this.findUserByEmail(active)
    }

    static logout() {
        localStorage.removeItem('active')
    }
}
import { UserModel } from "../models/user.model"

export class UserService {
    static findUserByEmail(email: string) {
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
        const users: UserModel[] = JSON.parse(localStorage.getItem('users')!)
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

    static getActiveUser() {
        const active = localStorage.getItem('active')
        if (!active)
            throw Error('Niste ulogovani')

        return this.findUserByEmail(active)
    }
}
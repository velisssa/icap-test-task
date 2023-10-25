export interface IAuth {
    username: string
    password: string
}

export interface IUser {
    id: number
    name: string
    email: string
    birthday_date: string
    phone_number: string
    address: string
}

export interface ITable {
    count: number
    next: string
    previous: string
    results: IUser[]
}


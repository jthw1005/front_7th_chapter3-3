export interface User {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  age: number
  phone: string
  image: string
  address: {
    address: string
    city: string
    state: string
  }
  company: {
    name: string
    title: string
  }
}

export interface UserSummary {
  id: number
  username: string
  image: string
}

export interface UsersResponse {
  users: UserSummary[]
  total: number
  skip: number
  limit: number
}

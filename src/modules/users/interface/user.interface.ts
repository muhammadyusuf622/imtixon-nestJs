import { UserRole } from "../enum";


export interface IjwtToken{
  role: UserRole | undefined,
  id: string,
}

export interface IdefaultAdmin {
  name: string,
  email: string,
  password: string,
  role: UserRole
}
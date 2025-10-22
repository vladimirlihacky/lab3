import { Role } from "../../common/types";
import * as API from "./api";

console.log('Get all users: ')
console.log(await API.getUsers())
console.log('Get user 1: ')
console.log(await API.getUser(1))
console.log('Remove 2 from user 1 friends: ')
console.log(await API.removeUserFriend(1, 2))
console.log('Get user 1: ')
console.log(await API.getUser(1))
console.log('Set user role to admin:')
console.log(await API.userSetRole(1, Role.Administrator))
console.log(
    `Role set to admin?:`, 
    (await API.getUser(1)).role === Role.Administrator
)
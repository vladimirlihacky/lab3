import config from "../../common/config";
import type { Message, Role, Status, User } from "../../common/types";
import type { Pagination } from "../../server/models";

const base = `http://${config.server.host}:${config.server.port}/api`;

const endpoint = (route: string) => `${base}/${route}`
const get = async (url: string) => {
    const response = await fetch(url); 
    const json = await response.json()

    return json;
}

const post = async (url: string, body: any) => {
    const response = await fetch(url, {
        method: "POST", 
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body),
    })

    const json = await response.json()

    return json;
}

export async function getUsers(pagination?: Pagination): Promise<User[]> {
    return await get(endpoint("users" + `?limit=${pagination?.limit}&offset=${pagination?.offset}`));
}

export async function getUser(id: number): Promise<User> {
    return await get(endpoint(`users/${id}`))
}

export async function getUserFriends(id: number): Promise<User[]> {
    return await get(endpoint(`users/${id}/friends`))
}

export async function getUserMessages(id: number): Promise<Message[]> {
    return await get(endpoint(`users/${id}/messages`))
}

export async function addUserFriend(id: number, friendId: number): Promise<User> {
    return await post(endpoint(`users/${id}/addFriend`), { id: friendId })
}

export async function removeUserFriend(id: number, friendId: number): Promise<User> {
    return await post(endpoint(`users/${id}/removeFriend`), { id: friendId })
}

export async function createUser(userData: any): Promise<User> {
    return await post(endpoint('users/create'), userData);
}

export async function updateUser(id: number, data: any): Promise<User> {
    return await post(endpoint(`users/${id}/update`), data);
}

export async function userSetStatus(id: number, status: Status): Promise<User> {
    return await post(endpoint(`users/${id}/setStatus`), { status })
}

export async function userSetRole(id: number, role: Role): Promise<User> {
    return await post(endpoint(`users/${id}/setRole`), { role })
}
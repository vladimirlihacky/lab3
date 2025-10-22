const statusMap = ["Unapproved", "Active", "Banned"]
const roleMap = ["Unauthorized", "Authorized", "Administrator"]

function users() {
    return {
        users: [],
        init() {
            getUsers().then(res => this.users = res);
        }
    }
}
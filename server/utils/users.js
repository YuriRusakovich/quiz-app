export default class Users {
    constructor () {
        this.users = [];
    }
    addUser(hostId, userId, name, gameData){
        const user = { hostId, userId, name, gameData };
        this.users.push(user);
        return user;
    }
    removeUser(userId){
        const user = this.getUser(userId);
        if (user) {
            this.users = this.users.filter((user) => user.userId !== userId);
        }
        return user;
    }
    getUser(userId){
        return this.users.filter((user) => user.userId === userId)[0];
    }
    getUsers(hostId){
        return this.users.filter((user) => user.hostId === hostId);
    }
}
export default class Users {
    constructor () {
        this.users = [];
    }
    addUser(hostId, userId, name, gameData, currentIsCorrect){
        const user = { hostId, userId, name, gameData, currentIsCorrect };
        this.users.push(user);
        return user;
    }
    updateUser(oldUserId, newUserId) {
        const user = this.users.filter((user) => user.userId === oldUserId)[0];
        const userIndex = this.users.findIndex((user) => user.userId === oldUserId);
        user.userId = newUserId;
        this.users[userIndex] = user;
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
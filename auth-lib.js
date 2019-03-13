var allUsers = new Map();

var allGroups = new Map();

var allRights = new Map();

var sessions = new Map();

function createUser(username, password) {
    if (username.length != 0){
        if (allUsers.has(username)){
            throw new Error("User is in the system");
        }
        allUsers.set(username, password);

        return username;
    }else {
        throw new Error("Username empty");
    }
};

function deleteUser(username) {
    if (username.length != 0){
        if (!allUsers.has(username)){
            throw new Error("No user found");
        }
        allUsers.delete(username);
    }else {
        throw new Error("Username empty");
    }
};

function users() {
    var usersArray = [];
    if (allUsers.size != 0){
        for (let user of allUsers.keys()){
            usersArray.push(user);
        }
        return usersArray;
    }else{
        throw new Error("No users so far");
    }
};

function createGroup(){

    let group = makeid();

    if (group.length != 0){
        if (allGroups.has(group)){
            throw new Error("Group defined already");
        }
        allGroups.set(group, []);
    }else{
        throw new Error("Group empty");
    }

    return group;
};

function deleteGroup(group) {
    if (group.length != 0){
        if (!allGroups.has(group)){
            throw new Error("No such a group");
        }
        allGroups.delete(group);
    }else{
        throw new Error("Group name empty");
    }
};

function groups() {
    let groups = [];
    return Array.from(allGroups.keys());
};

function addUserToGroup(username, group) {
    if (username.length == 0){
        throw new Error("Username empty");
    }
    if (group.length == 0){
        throw new Error("Group name empty");
    }
    if (!allUsers.has(username)){
        throw new Error("No user found");
    }
    if (!allGroups.has(group)){
        throw new Error("No group found");
    }
    if (allGroups.get(group).includes(username)){
        throw new Error("User is already in group");
    }
    //WATCH OUT!!!
    allGroups.get(group).push(username);
};

function userGroups(username) {

    let userGroups = [];

    if (username.length == 0){
        throw new Error("Username empty");
    }
    if (!allUsers.has(username)){
        throw new Error("No user found");
    }
    for (let group of allGroups.keys()){
        for (let i = 0, elem = allGroups.get(group); i < allGroups.get(group).length; i++){
            if (elem[i] == username){
                userGroups.push(group);
            }
        }
    }
    return userGroups;
};

function removeUserFromGroup(username, group) {

    if (username.length == 0){
        throw new Error("Username empty");
    }
    if (group.length == 0){
        throw new Error("Group name empty");
    }
    if (!allUsers.has(username)){
        throw new Error("No username");
    }
    if (!allGroups.has(group)){
        throw new Error("No such group exists");
    }
    if (!allGroups.get(group).includes(username)){
        throw new Error("No such user in group");
    }
    //WATCH OUT!!!
    allGroups.get(group).splice(allGroups.get(group).indexOf(username));
};

function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function createRight() {

    var right = makeid();

    if (right.length != 0){
        if (allRights.has(right)){
            throw new Error("Right defined already");
        }
        allRights.set(right, []);
    }else{
        throw new Error("Right empty");
    }

    return right;
};

function deleteRight(right) {
    if (right.length == 0){
        throw new Error("Right empty");
    }
    if (!allRights.has(right)){
        throw new Error("Right not found");
    }
    allRights.delete(right);
};

function groupRights(group) {
    let groupRights = [];

    if (group.length == 0){
        throw new Error("Group empty");
    }
    if (allRights.size == 0){
        throw new Error("No rights");
    }
    if(!allGroups.has(group)){
        throw new Error("No such group");
    }
    for (let right of allRights.keys()){
        for (let i = 0, elem = allRights.get(right); i < allRights.get(right).length; i++){
            if (elem[i] == group){
                groupRights.push(right);
            }
        }
    }
    return groupRights;
};

function rights() {

    if (allRights.size == 0){
        throw new Error("No rights");
    }

    return Array.from(allRights.keys());

};

function addRightToGroup(right, group) {
    if (right.length == 0){
        throw new Error("Right empty");
    }
    if (group.length == 0){
        throw new Error("Group name impty");
    }
    if (!allRights.has(right)){
        throw new Error("No such right");
    }
    if(!allGroups.has(group)){
        throw new Error("Now such group");
    }
    if(allRights.get(right).includes(group)){
        throw new Error("No group for this right found");
    }

    allRights.get(right).push(group);
};

function removeRightFromGroup(right, group) {

    if (right.length == 0){
        throw new Error("Right empty");
    }
    if (group.length == 0){
        throw new Error("Group name empty");
    }
    if (!allRights.has(right)){
        throw new Error("No such right");
    }
    if (!allGroups.has(group)){
        throw new Error("Now such group");
    }
    if(!allRights.get(right).includes(group)){
        throw new Error("No group for this right");
    }
    allRights.get(right).splice(allRights.get(right).indexOf(group));
};

function login(username, password) {

    //double-login eliminating
    if (!sessions.has(username)){
        sessions.set(username, false);
    }

    let connect = false;

    if (allUsers.has(username)){
        if (allUsers.get(username) === password){
            if (sessions.get(username) == false){
                sessions.set(username, true);
                connect = true;
            }else {
                connect = false;
            }
        } else {
            connect = false;
        }
    }else {
        connect = false
    }

    return connect;
};

function currentUser() {
    let current;
    for (let user of sessions.keys()){
        current = user;
    }
    return current;
};

function logout() {
    if (sessions.size != 0){
        sessions.clear();
    }
};

function isAuthorized(username, right) {

    let final = false;
    let userGroups = [];

    if (username.length == 0){
        throw new Error("Username empty");
    }
    if (right.length == 0){
        throw new Error("Right empty");
    }
    if (!allUsers.has(username)){
        throw new Error("No user in system");
    }
    if (allGroups.size == 0){
        throw new Error("Groups are empty");
    }
    if (!allRights.has(right)){
        throw new Error("No right in system");
    }

    for (let group of allGroups.keys()){
        for (let i = 0, elem = allGroups.get(group); i < allGroups.get(group).length; i++){
            if (elem[i] == username){
                userGroups.push(group);
            }
        }
    }

    let userRights = [];

    for (let right of allRights.keys()){
        for (let i = 0, elem = allRights.get(right); i < allRights.get(right).length; i++){
            for (let j = 0; j < userGroups.length; j++){
                if (userGroups[j] == elem[i]){

                    userRights.push(right);
                }
            }
        }
    }

    if (userRights.includes(right)){
        final = true;
    }else{
        final = false;
    }
    return final;
};

//TypeError: undefined is not an object (evaluating 'users().length') in http://localhost:63342/js-assignment-master/tests.js (line 395)

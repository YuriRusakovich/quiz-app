function updateUsers(data) {
    const div = document.getElementById('users');
    div.innerHTML = '';
    for (let i = 0; i < data.length; i++) {
        const user = document.createElement('div');
        const userName = document.createElement('div');
        user.setAttribute('class', 'user_wrapper');
        user.setAttribute('id', data[i].userId);
        const img = document.createElement('img');
        img.setAttribute('src', '/img/user.png');
        img.setAttribute('id', `${data[i].userId}_img`)
        img.setAttribute('class', 'user_img');
        userName.innerHTML = data[i].name;
        user.appendChild(img);
        user.appendChild(userName);
        div.appendChild(user);
    }
}

function prepareUser(data) {
    updateUsers(data);
    for (let i = 0; i < data.length; i++) {
        const user = document.getElementById(data[i].userId);
        const score = document.createElement('div');
        score.setAttribute('id', `${data[i].userId}_score`);
        score.setAttribute('class', 'score');
        score.innerHTML = `Score: ${data[i].gameData.score}`;
        user.appendChild(score);
    }
}
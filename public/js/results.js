const socket = io();

socket.on('connect', function () {
    socket.emit('getResults');
});

socket.on('resultsData', function(data) {
    const pageWrapper = document.getElementById('pageWrapper');
    pageWrapper.innerHTML = '';
    const title = document.createElement('h2');
    title.setAttribute('id', 'message');
    title.innerHTML = 'Results';
    let currentGameNum = data.length;
    pageWrapper.appendChild(title);
    for (let result of data) {
        const gridContainer = document.createElement('div');
        gridContainer.setAttribute('class', 'gridContainer');
        const gameHeader = document.createElement('div');
        gameHeader.setAttribute('class', 'gameHeader');
        gameHeader.innerHTML = `Game ${currentGameNum}`;
        gridContainer.appendChild(gameHeader);
        const gameNameTitle = document.createElement('div');
        gameNameTitle.setAttribute('class', 'gameNameTitle');
        gameNameTitle.innerHTML = 'Game name';
        gridContainer.appendChild(gameNameTitle);
        const gameName = document.createElement('div');
        gameName.setAttribute('class', 'gameName');
        gameName.innerHTML = result.name;
        gridContainer.appendChild(gameName);
        const gameTypeTitle = document.createElement('div');
        gameTypeTitle.setAttribute('class', 'gameTypeTitle');
        gameTypeTitle.innerHTML = 'Type';
        gridContainer.appendChild(gameTypeTitle);
        const gameType = document.createElement('div');
        gameType.setAttribute('class', 'gameType');
        gameType.innerHTML = result.type;
        gridContainer.appendChild(gameType);
        const gameLevelTitle = document.createElement('div');
        gameLevelTitle.setAttribute('class', 'gameLevelTitle');
        gameLevelTitle.innerHTML = 'Level';
        gridContainer.appendChild(gameLevelTitle);
        const gameLevel = document.createElement('div');
        gameLevel.setAttribute('class', 'gameLevel');
        gameLevel.innerHTML = result.level;
        gridContainer.appendChild(gameLevel);
        const gameDateTitle = document.createElement('div');
        gameDateTitle.setAttribute('class', 'gameDateTitle');
        gameDateTitle.innerHTML = 'Date';
        gridContainer.appendChild(gameDateTitle);
        const gameDate = document.createElement('div');
        gameDate.setAttribute('class', 'gameDate');
        const options = {
            hour12: false,
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric'
        };
        gameDate.innerHTML = new Date(result.date).toLocaleString('en-US', options);
        gridContainer.appendChild(gameDate);
        const usersHeader = document.createElement('div');
        usersHeader.setAttribute('class', 'usersHeader');
        usersHeader.innerHTML = `Users`;
        gridContainer.appendChild(usersHeader);
        const userNameTitle = document.createElement('div');
        userNameTitle.setAttribute('class', 'userNameTitle');
        userNameTitle.innerHTML = 'Name';
        gridContainer.appendChild(userNameTitle);
        const userScoreTitle = document.createElement('div');
        userScoreTitle.setAttribute('class', 'userScoreTitle');
        userScoreTitle.innerHTML = 'Score';
        gridContainer.appendChild(userScoreTitle);
        const usersGridWrapper = document.createElement('div');
        usersGridWrapper.setAttribute('class', 'usersGridWrapper');
        gridContainer.appendChild(usersGridWrapper);
        for (let user of result.users) {
            const usersGridContainer = document.createElement('div');
            usersGridContainer.setAttribute('class', 'usersGridContainer');
            const userName = document.createElement('div');
            userName.setAttribute('class', 'userName');
            userName.innerHTML = user.name;
            usersGridContainer.appendChild(userName);
            const userScore = document.createElement('div');
            userScore.setAttribute('class', 'userScore');
            userScore.innerHTML = user.score;
            usersGridContainer.appendChild(userScore);
            usersGridWrapper.appendChild(usersGridContainer);
        }
        pageWrapper.appendChild(gridContainer);
        currentGameNum--;
    }
    const backButton = document.createElement('button');
    backButton.setAttribute('class', 'button');
    backButton.setAttribute('onclick', `back()`)
    backButton.innerHTML = 'Back';
    pageWrapper.appendChild(backButton);
});

function back() {
    window.location.href = '../';
}
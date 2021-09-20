const socket = io();
let errors = [];

function updateDatabase(){
    const questions = [];
    const name = document.getElementById('name').value;
    if (!name) {
        errors.push('name_error');
    }
    const type = document.getElementById('type').value;
    const level = document.getElementById('level').value;
    for (let i = 1; i <= getQuestionNum(); i++) {
        const question = document.getElementById(`q${i}`).value;
        const answers = [];
        if (!question) {
            errors.push(`q${i}_error`);
        }
        for (let j = 1; j <= 4; j++) {
            const answer = document.getElementById(`${i}a${j}`).value;
            if (!answer) {
                errors.push(`${i}a${j}_error`);
            } else {
                answers.push(answer);
            }
        }
        const correct = document.getElementById(`correct${i}`).value;
        if (correct && (correct <= 0 || correct >=5)) {
            errors.push(`correct${i}_errorNumber`);
        }
        if (!correct) {
            errors.push(`correct${i}_error`);
        }
        questions.push({"question": question, "answers": answers, "correct": correct})
    }
    const quiz = { id: 0, 'name': name, 'type': type, 'level': level, 'questions': questions };
    if (errors.length) {
        for (let error of errors) {
            if (error.includes('Number')) {
                const err = document.getElementById(error);
                err.style.display = 'block';
                err.innerHTML = 'That field should contain 1-4 value.';
            } else {
                const err = document.getElementById(error);
                err.style.display = 'block';
                err.innerHTML = 'That field is required.';
            }
        }
    } else {
        socket.emit('newQuiz', quiz);
    }
}

function cancelGame(){
    if (confirm("Are you sure you want to exit? All work will be deleted.")) {
        window.location.href = "../";
    }
}

socket.on('startGameFromCreator', function(data){
    window.location.href = "../../host/?id=" + data;
});
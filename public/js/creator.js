const socket = io();
let questionNum = 1;

function updateDatabase(){
    const questions = [];
    const name = document.getElementById('name').value;
    const type = document.getElementById('type').value;
    const level = document.getElementById('level').value;
    for (let i = 1; i <= questionNum; i++) {
        const question = document.getElementById(`q${i}`).value;
        const answer1 = document.getElementById(`${i}a1`).value;
        const answer2 = document.getElementById(`${i}a2`).value;
        const answer3 = document.getElementById(`${i}a3`).value;
        const answer4 = document.getElementById(`${i}a4`).value;
        const correct = document.getElementById(`correct${i}`).value;
        const answers = [answer1, answer2, answer3, answer4];
        questions.push({"question": question, "answers": answers, "correct": correct})
    }
    const quiz = { id: 0, 'name': name, 'type': type, 'level': level, 'questions': questions };
    socket.emit('newQuiz', quiz);
}

function addQuestion(){
    questionNum += 1;
    const questionsDiv = document.getElementById('allQuestions');
    const newQuestionDiv = document.createElement('div');
    const questionLabel = document.createElement('label');
    const questionField = document.createElement('textarea');
    const answer1Label = document.createElement('label');
    const answer1Field = document.createElement('input');
    const answer2Label = document.createElement('label');
    const answer2Field = document.createElement('input');
    const answer3Label = document.createElement('label');
    const answer3Field = document.createElement('input');
    const answer4Label = document.createElement('label');
    const answer4Field = document.createElement('input');
    const correctLabel = document.createElement('label');
    const correctField = document.createElement('input');
    questionLabel.innerHTML = `Question ${questionNum}: `;
    questionField.setAttribute('class', 'question');
    questionField.setAttribute('id', `q${questionNum}`);
    questionField.setAttribute('type', 'text');
    answer1Label.innerHTML = "Answer 1: ";
    answer2Label.innerHTML = " Answer 2: ";
    answer3Label.innerHTML = "Answer 3: ";
    answer4Label.innerHTML = " Answer 4: ";
    correctLabel.innerHTML = "Correct Answer (1-4): ";
    answer1Field.setAttribute('id', `${questionNum}a1`);
    answer1Field.setAttribute('type', 'text');
    answer1Field.setAttribute('class', 'answer');
    answer2Field.setAttribute('id', `${questionNum}a2`);
    answer2Field.setAttribute('type', 'text');
    answer2Field.setAttribute('class', 'answer');
    answer3Field.setAttribute('id', `${questionNum}a3`);
    answer3Field.setAttribute('type', 'text');
    answer3Field.setAttribute('class', 'answer');
    answer4Field.setAttribute('id', `${questionNum}a4`);
    answer4Field.setAttribute('type', 'text');
    answer4Field.setAttribute('class', 'answer');
    correctField.setAttribute('id', `correct${questionNum}`);
    correctField.setAttribute('type', 'number');
    correctField.setAttribute('class', 'correct');
    correctField.setAttribute('min', '1');
    correctField.setAttribute('max', '4');
    newQuestionDiv.setAttribute('id', 'question-field');
    newQuestionDiv.appendChild(questionLabel);
    newQuestionDiv.appendChild(questionField);
    newQuestionDiv.appendChild(answer1Label);
    newQuestionDiv.appendChild(answer1Field);
    newQuestionDiv.appendChild(answer2Label);
    newQuestionDiv.appendChild(answer2Field);
    newQuestionDiv.appendChild(answer3Label);
    newQuestionDiv.appendChild(answer3Field);
    newQuestionDiv.appendChild(answer4Label);
    newQuestionDiv.appendChild(answer4Field);
    newQuestionDiv.appendChild(correctLabel);
    newQuestionDiv.appendChild(correctField);
    questionsDiv.appendChild(newQuestionDiv);
}

function cancelGame(){
    if (confirm("Are you sure you want to exit? All work will be deleted.")) {
        window.location.href = "../";
    }
}

socket.on('startGameFromCreator', function(data){
    window.location.href = "../../host/?id=" + data;
});
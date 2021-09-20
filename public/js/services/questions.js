let questionNum = 1;

function addQuestion(){
    questionNum += 1;
    const questionsDiv = document.getElementById('allQuestions');
    const newQuestionDiv = document.createElement('div');
    newQuestionDiv.setAttribute('id', 'question-field');
    const questionLabel = document.createElement('label');
    questionLabel.innerHTML = `Question ${questionNum}: `;
    newQuestionDiv.appendChild(questionLabel);
    const questionField = document.createElement('textarea');
    questionField.setAttribute('class', 'question');
    questionField.setAttribute('id', `q${questionNum}`);
    questionField.setAttribute('type', 'text');
    questionField.setAttribute('onchange',  `checkValidation("q${questionNum}")`);
    newQuestionDiv.appendChild(questionField);
    const questionError = document.createElement('div');
    questionError.setAttribute('id', `q${questionNum}_error`);
    questionError.setAttribute('class', 'error');
    newQuestionDiv.appendChild(questionError);
    for (let j = 1; j <= 4; j++) {
        const answerLabel = document.createElement('label');
        answerLabel.innerHTML = `Answer ${j}: `;
        newQuestionDiv.appendChild(answerLabel);
        const answerField = document.createElement('input');
        answerField.setAttribute('onchange',  `checkValidation("${questionNum}a${j}")`);
        answerField.setAttribute('id', `${questionNum}a${j}`);
        answerField.setAttribute('type', 'text');
        answerField.setAttribute('class', 'answer');
        newQuestionDiv.appendChild(answerField);
        const answerError = document.createElement('div');
        answerError.setAttribute('id', `${questionNum}a${j}_error`);
        answerError.setAttribute('class', 'error');
        newQuestionDiv.appendChild(answerError);
    }
    const correctLabel = document.createElement('label');
    correctLabel.innerHTML = "Correct Answer (1-4): ";
    newQuestionDiv.appendChild(correctLabel);
    const correctField = document.createElement('input');
    correctField.setAttribute('onchange',  `checkValidation("correct${questionNum}")`);
    correctField.setAttribute('id', `correct${questionNum}`);
    correctField.setAttribute('type', 'number');
    correctField.setAttribute('class', 'correct');
    correctField.setAttribute('min', '1');
    correctField.setAttribute('max', '4');
    newQuestionDiv.appendChild(correctField);
    const correctError = document.createElement('div');
    correctError.setAttribute('id', `correct${questionNum}_error`);
    correctError.setAttribute('class', 'error');
    newQuestionDiv.appendChild(correctError);
    const correctErrorNumber = document.createElement('div');
    correctErrorNumber.setAttribute('id', `correct${questionNum}_errorNumber`);
    correctErrorNumber.setAttribute('class', 'error');
    newQuestionDiv.appendChild(correctErrorNumber);
    questionsDiv.appendChild(newQuestionDiv);
}

function getQuestionNum() {
    return questionNum;
}

class GetData {
    static go(url) {
        return new Promise(function (resolve, reject) {
            let xml = new XMLHttpRequest();

            xml.open('GET', url);
            xml.onreadystatechange = function () {
                if (xml.status == 200 && xml.readyState == 4) {
                    resolve(JSON.parse(xml.responseText));
                }
            }
            xml.send();
        })
    }
}


// DIVs

const landingPage = document.getElementById('landing-page-container');
const quizPage = document.getElementById('quiz-container');
const mainPage = document.getElementById('main-page-container');
const quizButton = document.getElementById('quiz-button');
const quizQuestion = document.getElementById('quiz-question-section');
const quizAnswers = document.getElementById('quiz-answers-section');
const resultPage = document.getElementById('result-page-container');
const resultSection = document.getElementById("result-page-section");
const quizResult = document.getElementById('quiz-result');
const highscoresPage = document.getElementById('highscores-container');
const highscoresUsernamesWrapper = document.getElementById('highscores-usernames-wrapper');
const highscoresScoresWrapper = document.getElementById('highscores-scores-wrapper');

// BUTTONS

const mainMenuBtn = document.getElementById('main-menu-btn');
const backMainMenuBtn = document.getElementById('back-main-menu-btn');
const playAgainBtn = document.getElementById('play-again-btn');
const highscoresBtn = document.getElementById('highscores-btn');
const logoutBtn = document.getElementById('logout-quiz-btn');
const startQuizButton = document.getElementById('start-quiz-btn');
const highMainMenuBtn = document.getElementById('high-main-menu-btn');

// VAR

var currentQuestion = 0;
var listOfAnswers;
var listElement;
var highscoresUsernames;
var highscoresScores;
var selectedAnswer;
var playingAgain = false;
var username = null;
var questions;
var firstQuestion = false;
var points;
var highscores = [];
var correctAnswer;
var highscoreListCreated = false;
// var highscoreListDeleted = true;

class Highscore {
    constructor(points, questionLenght) {
        this.username = userLocalStorage.getUser(),
            this.points = points,
            this.questionsLenght = questionLenght
    }
}

// LOCAL STORAGE

var userLocalStorage = {
    setUser: function (newUserData) {
        localStorage.setItem('userData', JSON.stringify(newUserData));
    },
    getUser: function () {
        return JSON.parse(localStorage.getItem('userData'));
    },
    deleteUser: function () {
        localStorage.removeItem('userData');
    }
}

var highscoresLocalStorage = {
    setHighscores: function (newHighscoresData) {
        localStorage.setItem('highscoresData', JSON.stringify(newHighscoresData));
    },
    getHighscores: function () {
        return JSON.parse(localStorage.getItem('highscoresData'));
    }
}


// LOGIN PAGE

function notEmptyInput() {
    let usernameInput = document.getElementById('username-input'),
        usernameValue = usernameInput.value;
    return usernameValue;
}

function showHighscores() {
    mainPage.style.display = 'none';
    quizPage.style.display = 'none';
    resultPage.style.display = 'none';
    highscoresPage.style.display = 'block';

    highscoresUsernames = document.createElement('ul');
    highscoresUsernames.setAttribute('id', 'highscores-usernames');

    highscoresScores = document.createElement('ul');
    highscoresScores.setAttribute('id', 'highscores-scores');

    highscoresUsernamesWrapper.appendChild(highscoresUsernames);
    highscoresScoresWrapper.appendChild(highscoresScores);

    highscores = highscoresLocalStorage.getHighscores();
    highscores.sort(function (a, b) {
        return b.points - a.points;
    });

    highscores.forEach(highscore => {

        let usernameListElement = document.createElement('li');
        let scoresListElement = document.createElement('li');

        let resultStr = `${highscore.points} / ${highscore.questionsLenght}`;

        highscoresUsernames.appendChild(usernameListElement);
        usernameListElement.textContent = highscore.username;

        highscoresScores.appendChild(scoresListElement);
        scoresListElement.textContent = resultStr;

    });
    highscoreListCreated = true;
    // highscoreListDeleted = false;
}

function destroyHighscoresList() {
    highscoresUsernames.parentNode.removeChild(highscoresUsernames);
    highscoresScores.parentNode.removeChild(highscoresScores);
    // highscoreListDeleted = true;
    highscoreListCreated = false;

}

function toMainMenu() {
    username = notEmptyInput();
    if (!username) return;

    if (userLocalStorage.getUser() !== username) {
        userLocalStorage.setUser(username);
    }


    resultPage.style.display = 'none';
    landingPage.style.display = 'none';
    highscoresPage.style.display = 'none';

    mainPage.style.display = 'block';

    if (highscoreListCreated) {
        destroyHighscoresList();
    }

}

function logout() {

    userLocalStorage.deleteUser();

    let usernameInput = document.getElementById('username-input');
    usernameInput.value = null;

    mainPage.style.display = 'none';
    highscoresPage.style.display = 'none';
    landingPage.style.display = 'block';

}

function startQuiz() {

    let questionsPromise = GetData.go('https://opentdb.com/api.php?amount=5&type=multiple');

    resultPage.style.display = 'none';
    mainPage.style.display = 'none';
    highscoresPage.style.display = 'none';
    quizPage.style.display = 'block';
    quizResult.textContent = null;

    questionsPromise.then(function (res) {
        questions = res.results;
        questions.forEach(question => {
            question.answers = question.incorrect_answers;
            question.answers.push(question.correct_answer);
            question.answers.sort();
        });

        firstQuestion = true;
        createList();
        showQuestion();
        points = 0;
    })
    quizButton.addEventListener('click', nextQuestion);
}

function createList() {
    listOfAnswers = document.createElement('ul');
    listOfAnswers.setAttribute('id', 'answers-list');
    quizAnswers.appendChild(listOfAnswers);
    for (i = 0; i < questions[currentQuestion].answers.length; i++) {
        listElement = document.createElement('li');
        listElement.addEventListener('click', checkAnswer);
        // answer.addEventListener('click', selectedAnswer);
        listOfAnswers.appendChild(listElement);
    }
}

function destroyList() {
    listOfAnswers.parentNode.removeChild(listOfAnswers);
}

function checkAnswer() {
    if (selectedAnswer) return;
    selectedAnswer = this;
    let correctAnswerStr = convert(questions[currentQuestion].correct_answer);
    if (selectedAnswer.textContent === correctAnswerStr) {
        selectedAnswer.classList.add('correct-answer');
        points++;
    } else {
        correctAnswer.classList.add('correct-answer');
        selectedAnswer.classList.add('wrong-answer');
    }

}

function convert(str) {
    str = str.replace(/&amp;/g, "&");
    str = str.replace(/&gt;/g, ">");
    str = str.replace(/&lt;/g, "<");
    str = str.replace(/&quot;/g, '"');
    str = str.replace(/&#039;/g, "'");
    str = str.replace(/&Uuml;/g, "u");
    return str;
}

function nextQuestion() {
    if (!selectedAnswer) {
        alert('You must select one answer!')
        return;
    };
    currentQuestion++;
    destroyList();
    createList();
    showQuestion();
}

function showQuestion() {

    if (currentQuestion === questions.length) return;

    var strQuestion = questions[currentQuestion].question;
    quizQuestion.textContent = convert(strQuestion);
    var listAnswers = document.getElementById('answers-list').children;

    for (i = 0; i < questions[currentQuestion].answers.length; i++) {
        let answer = listAnswers[i];
        let strAnswer = questions[currentQuestion].answers[i];
        if (strAnswer === questions[currentQuestion].correct_answer) {
            correctAnswer = answer;
        }
        answer.textContent = convert(strAnswer);
    }

    if (currentQuestion === questions.length - 1) {
        quizButton.removeEventListener('click', nextQuestion);
        quizButton.addEventListener('click', finishQuiz);
        quizButton.textContent = 'Finish';
    } else {
        quizButton.textContent = 'Next';
    }
    selectedAnswer = null;
}

function resetQuiz() {
    currentQuestion = 0;
    destroyList();
    quizQuestion.textContent = null;
    quizButton.textContent = null;
}

function finishQuiz() {

    resetQuiz();

    quizButton.removeEventListener('click', finishQuiz);

    quizPage.style.display = 'none';
    resultPage.style.display = 'block';

    let strResult = `${points}/${questions.length}`;
    quizResult.textContent = strResult;
    quizResult.classList.add('big-text');

    playAgainBtn.addEventListener('click', startQuiz);
    backMainMenuBtn.addEventListener('click', toMainMenu);

    highscores = highscoresLocalStorage.getHighscores();
    highscores.push(new Highscore(points, questions.length));
    highscoresLocalStorage.setHighscores(highscores);

}

(function init() {
    mainPage.style.display = 'none';
    quizPage.style.display = 'none';
    resultPage.style.display = 'none';
    highscoresPage.style.display = 'none';
    mainMenuBtn.addEventListener('click', toMainMenu);
    highscoresBtn.addEventListener('click', showHighscores);
    logoutBtn.addEventListener('click', logout);
    startQuizButton.addEventListener('click', startQuiz);
    highMainMenuBtn.addEventListener('click', toMainMenu);
    if (!highscoresLocalStorage.getHighscores()) {
        highscoresLocalStorage.setHighscores(highscores);
    }
})();
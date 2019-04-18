
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


const quizPage = document.getElementById('quiz-container');
const mainPage = document.getElementById('main-page-container');
const quizButton = document.getElementById('quiz-button');
const quizQuestion = document.getElementById('quiz-question-section');
const quizAnswers = document.getElementById('quiz-answers-section');

(function init() {
    mainPage.style.display = 'none';
    quizPage.style.display = 'none';
})();

class User {
    constructor(id, username) {
        this.id = id;
        this.username = username;
        this.score = 0;
    }
}

var userLocalStorage = {
    setUser: function (newUserData) {
        localStorage.setItem('userData', JSON.stringify(newUserData));
    },
    getUser: function () {
        return JSON.parse
    }
}
// LOGIN PAGE
var mainPageBtn = document.getElementById('main-menu-btn');
mainPageBtn.addEventListener('click', toMainMenu);


function notEmptyInput() {
    var usernameInput = document.getElementById('username-input'),
        usernameValue = usernameInput.value;
    return usernameValue;
}

function saveUser(username) {
    localStorage.setItem('users', username);
}

function toMainMenu() {

    if (!notEmptyInput()) return;

    var landingPage = document.getElementById('landing-page-container');
    landingPage.style.display = 'none';
    mainPage.style.display = 'block';

    var startQuizButton = document.getElementById('start-quiz-btn');
    startQuizButton.addEventListener('click', startQuiz);
}

var questions;

function startQuiz() {


    let questionsPromise = GetData.go('https://opentdb.com/api.php?amount=5&type=multiple');

    mainPage.style.display = 'none';
    quizPage.style.display = 'block';

    questionsPromise.then(function (res) {
        questions = res.results;
        questions.forEach(question => {
            question.answers = question.incorrect_answers;
            question.answers.push(question.correct_answer);
        });
        console.log(questions);
        createList();
        showQuestion();

    })
    quizButton.addEventListener('click', showQuestion);
}

var currentQuestion = 0;
var listOfAnswers;
var listElement;

function createList() {
    listOfAnswers = document.createElement('ul');
    quizAnswers.appendChild(listOfAnswers);
    for (i = 0; i < questions[currentQuestion].answers.length; i++) {
        listElement = document.createElement('li');
        // answer.addEventListener('click', selectedAnswer);
        listElement.setAttribute('id', i);
        listOfAnswers.appendChild(listElement);
    }
}

function destroyList() {
    listOfAnswers.parentNode.removeChild(listOfAnswers);
}

var firstQuestion = true;

function showQuestion() {

    if (currentQuestion >= questions.length) return;

    if (!firstQuestion) {
        destroyList();
        createList();
    }

    console.log(questions[currentQuestion].question);
    quizQuestion.textContent = questions[currentQuestion].question.replace(/(&quot\;)/g, "\"");

    for (i = 0; i < questions[currentQuestion].answers.length; i++) {

        let answer = document.getElementById(i);
        answer.textContent = questions[currentQuestion].answers[i];
    }

    if (currentQuestion == questions.length - 1) {
        quizButton.textContent = 'Finish';
    } else {
        quizButton.textContent = 'Next';
    }

    currentQuestion++;
    firstQuestion = false;
}


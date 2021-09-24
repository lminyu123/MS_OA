const myQuestions = [
    {
      question: "1. How is the entity on the right panel relevant to the query?",
      answers: {
        a: "Excellent",
        b: "Good",
        c: "Poor"
      },
      correctAnswer: "a"
    },
    {
      question: "2. Which parts of content are releant to the query?",
      answers: {
        a: "Image",
        b: "Name",
        c: "Description"
      },
      correctAnswer: "c"
    },
];

function generateQuiz(questions, quizContainer, submitButton, skipButton) {

    var passFirstQuestion = false;
    var q1_value = 0;
    var q2_value = 0;

    // generate single question
    function generateQuestion(questions, num, output) {        
        // define answer list
        answers = [];

        // for each choice option for given question
        for(letter in questions[num].answers){

            // add an html radio button
            answers.push(
                '<label>'
                    + '<input type="radio" name="question' + (passFirstQuestion ? letter : num) +'" value="' + letter + '">'
                    + questions[num].answers[letter]
                + '</label>'
                + '<br>'
            );   
        }

        // add this question and its answers to the output
        output.push(
            '<div class = "card border-dark mb-3">'
            + '<div class="question card-header">' + questions[num].question + '</div>'
            + '<div class="answers card-body">' + answers.join('') + '</div>' 
            + '</div>' + '<br>'
        );
    }

	function showQuestions(questions, quizContainer) {
		// we'll need a place to store the output and the answer choices
        var output = [];

        // conditional displaying the question
        if (!passFirstQuestion) {
            generateQuestion(questions, 0, output); 
        } else {
            generateQuestion(questions, 1, output);             
        }
               
        // display the question to the HTML page
        quizContainer.innerHTML = output.join('');
	}

    // hide the button to user
    async function sendResults() {
        // hide the button
        submitButton.style.visibility = 'hidden';
        skipButton.style.visibility = 'hidden';

        // send user score to server
        // SnedToServer(q1_value + q2_value);
        console.log(`Sent total socre: ${q1_value + q2_value} to server`);
        alert(`Sent total socre: ${q1_value + q2_value} to server`);
    }

	function showResults(questions, quizContainer) {
		// gather answer containers from our quiz
        var answerContainers = quizContainer.querySelectorAll('.answers');
       
        // validate 1st question
        if (!passFirstQuestion) {
            var userAnswer = (answerContainers[0].querySelector('input[name=question'+0+']:checked')||{}).value;
        
            if (userAnswer === 'a') {
                q1_value = 100;

                // display Q2
                passFirstQuestion = true;
                showQuestions(questions, quizContainer);

            } else if (userAnswer === 'b') {
                q1_value = 50;
                sendResults();
            } else if (userAnswer === 'c') {
                q1_value = 0;
                sendResults();
            }
        } else {
            // validate 2nd question
            var userAnswerA = (answerContainers[0].querySelector('input[name=question'+'a'+']:checked')||{}).value;
            var userAnswerB = (answerContainers[0].querySelector('input[name=question'+'b'+']:checked')||{}).value;
            var userAnswerC = (answerContainers[0].querySelector('input[name=question'+'c'+']:checked')||{}).value;
            
            if (userAnswerA === 'a') { 
                q2_value += 50;
            } 
            if (userAnswerB === 'b') {   
                q2_value += 50;
            } 
            if (userAnswerC === 'c') {
                q2_value += 25;
            }

            if (q2_value > 0) {
                sendResults();
            } else {
                // user didn't make choice
                showQuestions(questions, quizContainer);
            }
            
        }
        
	}

	// show the questions
	showQuestions(questions, quizContainer);

	// when user clicks submit, show results
	submitButton.onclick = function() {
		showResults(questions, quizContainer);
	}

    skipButton.onclick = function() {
        // reset user's input 
        q1_value = 0;
        q2_value = 0;
        passFirstQuestion = false;

        location.reload();
    }
}

var quizContainer = document.getElementById('quiz');
var submitButton = document.getElementById('submit');
var skipButton = document.getElementById('skip');

generateQuiz(myQuestions, quizContainer, submitButton, skipButton);
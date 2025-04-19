let currentQuestion = 0;
let score = 0;
let questions = [];
let userAnswers = [];

$(document).ready(function () {
  $.getJSON("questions.json", function (data) {
    questions = data;
  });


  $("#start-btn").click(function () {
    $("#start-screen").fadeOut(() => {
      showQuestion();
      $("#question-box").fadeIn();
      $("#next-btn").fadeIn();
    });
  });


  $("#next-btn").click(function () {
    let selected = $("input[name='choice']:checked").val();
    if (!selected) {
      alert("Please select an answer.");
      return;
    }

    userAnswers.push(selected);

    if (selected === questions[currentQuestion].answer) {
      score++;
    }

    currentQuestion++;

    if (currentQuestion < questions.length) {
      showQuestion();
    } else {
      $("#question-box").hide();
      $("#next-btn").hide();
      $("#score").text(`${score} / ${questions.length}`);
      $("#score-box").show();
      showReview();             
      $("#review-box").hide();  
      $("#restart-btn").fadeIn(); 
      $("#toggle-review-btn").fadeIn(); 
    }
  });

  
  $("#toggle-review-btn").click(function () {
    const isVisible = $("#review-box").is(":visible"); 
    $("#review-box").slideToggle(); 
    $(this).text(isVisible ? "SHOW RESULT" : "HIDE RESULT");
  });

 
  $("#restart-btn").click(function () {

    currentQuestion = 0;
    score = 0;
    userAnswers = [];
    $("#review-box").hide();
    $("#score-box").hide();

    $("#start-screen").fadeIn();
    $("#restart-btn").hide();
    $("#toggle-review-btn").hide();

    $("#question-box").hide();
    $("#next-btn").hide();
  });
});

function showQuestion() {
  let q = questions[currentQuestion];
  $("#question-text").text(q.question);
  let choicesHtml = "";

  q.choices.forEach(choice => {
    choicesHtml += `
      <li>
        <label>
          <input type="radio" name="choice" value="${choice}"> ${choice}
        </label>
      </li>`;
  });

  $("#choices-list").html(choicesHtml);
}


function showReview() {
  let reviewHtml = "";

  questions.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === q.answer;
    const resultClass = isCorrect ? "correct" : "incorrect";

    reviewHtml += `
      <li class="${resultClass}">
        <strong>Q${index + 1}.</strong> ${q.question}<br>
        <br>
        <span><strong>Your Answer:</strong> ${userAnswer}</span><br>
        <span><strong>Correct Answer:</strong> ${q.answer}</span>
      </li>`;
  });

  $("#review-list").html(reviewHtml);
}

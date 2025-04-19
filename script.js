let currentQuestion = 0;
let score = 0;
let questions = [];
let userAnswers = [];

$(document).ready(function () {
  // Load questions from questions.json
  $.getJSON("questions.json", function (data) {
    questions = data;
  });

  // Start quiz
  $("#start-btn").click(function () {
    $("#start-screen").fadeOut(() => {
      showQuestion();
      $("#question-box").fadeIn();
      $("#next-btn").fadeIn();
    });
  });

  // Next question button
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
      showReview();             // generate review content
      $("#review-box").hide();  // hide review by default
    }
  });

  // Toggle review visibility
  $("#toggle-review-btn").click(function () {
    $("#review-box").slideToggle(); // slide up/down
    const isVisible = $("#review-box").is(":visible");
    $(this).text(isVisible ? "Hide Review" : "Show Review");
  });
});

// Function to show the current question
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

// Function to show the review of answers
function showReview() {
  let reviewHtml = "";

  questions.forEach((q, index) => {
    const userAnswer = userAnswers[index];
    const isCorrect = userAnswer === q.answer;
    const resultClass = isCorrect ? "correct" : "incorrect";

    reviewHtml += `
      <li class="${resultClass}">
        <strong>Q${index + 1}:</strong> ${q.question}<br>
        <span>Your Answer: ${userAnswer}</span><br>
        <span>Correct Answer: ${q.answer}</span>
      </li>`;
  });

  $("#review-list").html(reviewHtml);
}

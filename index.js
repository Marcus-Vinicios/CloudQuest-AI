let apiKey = "";
let totalQuestions = 0;
let currentQuestionNum = 0;
let score = 0;
let isAnswered = false;
let currentQuestionData = null;

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", startQuiz);
  document.getElementById("actionBtn").addEventListener("click", handleAction);
  document.getElementById("resetBtn").addEventListener("click", resetQuiz);
});
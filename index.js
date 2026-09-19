let apiKey = "";
let totalQuestions = 0;
let currentQuestionNum = 0;
let score = 0;
let isAnswered = false;
let currentQuestionData = null;
let questionsCache = [];

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("startBtn").addEventListener("click", startQuiz);
  document.getElementById("actionBtn").addEventListener("click", handleAction);
  document.getElementById("resetBtn").addEventListener("click", resetQuiz);
});

function switchScreen(screenId) {
  document
    .querySelectorAll(".screen")
    .forEach((s) => s.classList.remove("active"));
  document.getElementById(screenId).classList.add("active");
}

function startQuiz() {
  apiKey = document.getElementById("apiKey").value.trim();
  if (!apiKey) {
    alert("Por favor, insira a chave da API.");
    return;
  }
  totalQuestions = parseInt(document.getElementById("questionCount").value);
  currentQuestionNum = 0;
  score = 0;
  questionsCache = [];

  switchScreen("quizScreen");
  fetchAllQuestions();
}
async function fetchAllQuestions() {
  document.getElementById("quizContent").style.display = "none";
  document.getElementById("loadingState").style.display = "block";
  
  document.querySelector(".loading-state p").innerText = 
    `A IA está a formular um lote de ${totalQuestions} questões inéditas. Aguarde...`;

  const promptText = `
    Atue como um examinador da certificação AWS Cloud Practitioner.
    Crie exatamente ${totalQuestions} questões de múltipla escolha INÉDITAS, de nível oficial da prova.
    Varie os temas (Segurança, EC2, S3, Bancos de Dados, Faturamento, Arquitetura).
    Você DEVE retornar APENAS um ARRAY JSON válido contendo os objetos, sem markdown, sem formatação.
    Formato exigido:
    [
      {
          "q": "O texto da pergunta",
          "opts": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
          "ans": "O texto exato da opção que está correta",
          "exp": "A explicação detalhada de por que essa opção está correta."
      }
    ]
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: promptText }] }],
          generationConfig: { temperature: 0.7 },
        }),
      },
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Código ${response.status}: ${errorData.error?.message || "Erro desconhecido"}`);
    }

    const data = await response.json();
    let rawJson = data.candidates[0].content.parts[0].text;

    rawJson = rawJson
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();
      
    questionsCache = JSON.parse(rawJson);

    totalQuestions = questionsCache.length;

    loadNextQuestion(); 
  } catch (error) {
    alert("Erro ao gerar as questões. Detalhes: " + error.message);
    switchScreen("setupScreen");
  }
}

function loadNextQuestion() {
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("quizContent").style.display = "block";
  
  isAnswered = false;
  
  currentQuestionData = questionsCache[currentQuestionNum];
  currentQuestionNum++;
  
  document.querySelector(".loading-state p").innerText = "A IA está formulando uma pergunta inédita...";

  renderQuestion();
}

function renderQuestion() {
  document.getElementById("questionCounter").innerText =
    `Questão ${currentQuestionNum} de ${totalQuestions}`;
  document.getElementById("scoreCounter").innerText = `Acertos: ${score}`;
  document.getElementById("questionText").innerText = currentQuestionData.q;

  const optsContainer = document.getElementById("optionsContainer");
  optsContainer.innerHTML = "";

  let shuffledOpts = shuffleArray([...currentQuestionData.opts]);

  shuffledOpts.forEach((opt) => {
    const label = document.createElement("label");
    label.className = "option-label";
    label.innerHTML = `<input type="radio" name="answer" value="${opt}"> ${opt}`;
    optsContainer.appendChild(label);
  });

  document.querySelectorAll('input[name="answer"]').forEach((radio) => {
    radio.addEventListener("change", enableButton);
  });

  const btn = document.getElementById("actionBtn");
  btn.innerText = "Confirmar Resposta";
  btn.disabled = true;

  const expBox = document.getElementById("explanationBox");
  expBox.style.display = "none";
  expBox.innerText = currentQuestionData.exp;
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function checkAnswer() {
  const selectedRadio = document.querySelector('input[name="answer"]:checked');
  if (!selectedRadio) return;

  isAnswered = true;
  const isCorrect = selectedRadio.value === currentQuestionData.ans;
  if (isCorrect) score++;

  document.querySelectorAll(".option-label").forEach((label) => {
    label.classList.add("disabled");
    const input = label.querySelector("input");
    input.disabled = true;

    if (input.value === currentQuestionData.ans) {
      label.classList.add("correct");
    } else if (input.checked && !isCorrect) {
      label.classList.add("incorrect");
    }
  });

  document.getElementById("explanationBox").style.display = "block";
  document.getElementById("scoreCounter").innerText = `Acertos: ${score}`;
  document.getElementById("actionBtn").innerText =
    currentQuestionNum === totalQuestions
      ? "Finalizar Simulado"
      : "Próxima Questão";
}

function showResults() {
  switchScreen("resultScreen");
  const percentage = Math.round((score / totalQuestions) * 100);

  const circle = document.getElementById("scoreCircle");
  circle.innerText = `${percentage}%`;
  circle.style.backgroundColor =
    percentage >= 70 ? "var(--correct-text)" : "var(--incorrect-text)";
  circle.style.borderColor =
    percentage >= 70 ? "var(--correct-border)" : "var(--incorrect-border)";

  document.getElementById("resultMessage").innerText =
    `Você acertou ${score} de ${totalQuestions} questões geradas pela IA.`;
}

function resetQuiz() {
  switchScreen("setupScreen");
}

function enableButton() {
  if (!isAnswered) document.getElementById("actionBtn").disabled = false;
}

function handleAction() {
  if (!isAnswered) {
    checkAnswer();
  } else {
    if (currentQuestionNum < totalQuestions) {
      loadNextQuestion();
    } else {
      showResults();
    }
  }
}
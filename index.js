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

  switchScreen("quizScreen");
  fetchNextQuestion();
}

async function fetchNextQuestion() {
  document.getElementById("quizContent").style.display = "none";
  document.getElementById("loadingState").style.display = "block";
  isAnswered = false;
  currentQuestionNum++;

  const promptText = `
    Atue como um examinador da certificação AWS Cloud Practitioner.
    Crie UMA questão de múltipla escolha INÉDITA, de nível oficial da prova.
    Varie os temas (Segurança, EC2, S3, Bancos de Dados, Faturamento, Arquitetura).
    Você DEVE retornar APENAS um objeto JSON válido, sem markdown, sem formatação, apenas o JSON.
    Formato exigido:
    {
        "q": "O texto da pergunta",
        "opts": ["Opção 1", "Opção 2", "Opção 3", "Opção 4"],
        "ans": "O texto exato da opção que está correta",
        "exp": "A explicação detalhada de por que essa opção está correta."
    }
`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.6-flash:generateContent?key=${apiKey}`,
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
    currentQuestionData = JSON.parse(rawJson);

    renderQuestion();
  } catch (error) {
    alert("Erro ao gerar questão. Detalhes: " + error.message);
    currentQuestionNum--;
    switchScreen("setupScreen");
  }
}

function renderQuestion() {
  document.getElementById("loadingState").style.display = "none";
  document.getElementById("quizContent").style.display = "block";

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
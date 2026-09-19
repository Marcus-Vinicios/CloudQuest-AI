# 🚀 CloudQuest AI: Simulador Dinâmico para Certificação AWS

> Um simulador de exames interativo e inteligente para a certificação **AWS Cloud Practitioner**, construído com **HTML5, CSS3 e JavaScript**, alimentado ao vivo pela **API do Google Gemini (IA)**.

---

## 💡 Sobre o Projeto

Diferente dos simuladores tradicionais que utilizam listas estáticas de perguntas fixas, o **CloudQuest AI** aproveita o poder da Inteligência Artificial generativa para criar **questões inéditas e exclusivas** a cada rodada. 

O sistema varia automaticamente entre os principais domínios exigidos pela prova oficial da AWS (Segurança, EC2, S3, Bancos de Dados, Faturamento e Arquitetura), garantindo uma experiência de estudo dinâmica, imprevisível e altamente realista.

---

## ✨ Funcionalidades Principais

* **Geração Dinâmica via IA:** Nenhuma questão se repete; a IA formula novos cenários a cada teste.
* **Embaralhamento Inteligente:** As alternativas de resposta são reorganizadas aleatoriamente a cada exibição para evitar memorização visual.
* **Feedback Imediato e Explicativo:** Após a resposta, o sistema desativa as opções, destaca o acerto/erro e exibe uma explicação detalhada fundamentada nas boas práticas da AWS.
* **Arquitetura Limpa:** Código totalmente modularizado em três camadas (`index.html`, `index.js`, `style.css`), sem dependências de frameworks pesados.
* **Segurança no Cliente:** O projeto prioriza a privacidade utilizando a chave de API inserida localmente pelo próprio utilizador, sem salvá-la em servidores públicos.

---

## 🛠️ Tecnologias Utilizadas

* **HTML5** (Estrutural e Semântico)
* **CSS3** (Variáveis, Flexbox e Animações customizadas)
* **JavaScript Moderno (ES6+)** (Manipulação de DOM, Fetch API e Async/Await)
* **Google Gemini API** (Motor de Inteligência Artificial)

---

## ⚙️ Como Executar o Projeto Localmente

1. **Clone o repositório:**
   ```bash
   git clone [https://github.com/SMarcus-Vinicios/cloudquest-ai.git](https://github.com/Marcus-Vinicios/cloudquest-ai.git)
2. Certifique-se de que os três arquivos (`index.html`, `index.js` e `style.css`) estão na mesma pasta.
3. Abra o `index.html` usando um servidor local (se usar o VS Code, recomendo a extensão **Live Server**).
4. Insira a sua chave da API do Gemini (veja abaixo) e comece o teste!

> **Como conseguir a chave?** É 100% gratuito e rápido no [Google AI Studio](https://aistudio.google.com/app/apikey).

---

## 🔒 Um recado importante sobre segurança

Como este projeto roda inteiramente no navegador (frontend), **nunca coloque a sua chave de API escrita direto no código** antes de subir pro GitHub. O aplicativo foi desenhado para pedir a chave direto na tela de login de forma segura, garantindo que as suas credenciais fiquem apenas com você.

---

## 🤝 Contribuções e Ideias

Achou algum bug, quer sugerir uma melhoria no prompt da IA ou mudar o layout? Sinta-se totalmente à vontade para abrir uma *Issue* ou mandar um *Pull Request*. Todo feedback é super bem-vindo!

Bons estudos e boa sorte na prova da AWS! ☁️🚀
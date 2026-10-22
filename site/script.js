const KEY = "catdog-votes";

function load(key, fallback) {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
}

function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // storage blocked (private mode): data just won't persist
  }
}

const $ = (id) => document.getElementById(id);

/* ---------- votes ---------- */
function render(votes) {
  const total = votes.cat + votes.dog;
  const catPct = total ? Math.round((votes.cat / total) * 100) : 50;

  $("cat-bar").style.width = catPct + "%";
  $("dog-bar").style.width = (100 - catPct) + "%";
  $("tally").textContent = total
    ? `Cats: ${votes.cat} (${catPct}%) · Dogs: ${votes.dog} (${100 - catPct}%)`
    : "No votes yet.";

  let verdict = "";
  if (votes.cat > votes.dog) verdict = "Cats are winning! 🐱";
  else if (votes.dog > votes.cat) verdict = "Dogs are winning! 🐶";
  else if (total) verdict = "It's a tie!";
  $("verdict").textContent = verdict;
}

let votes = load(KEY, { cat: 0, dog: 0 });
render(votes);

document.querySelectorAll("[data-vote]").forEach((btn) => {
  btn.addEventListener("click", () => {
    votes[btn.dataset.vote]++;
    save(KEY, votes);
    render(votes);
  });
});

$("reset").addEventListener("click", () => {
  votes = { cat: 0, dog: 0 };
  save(KEY, votes);
  render(votes);
});

/* ---------- +1 on arguments ---------- */
const argVotes = load("catdog-args", {});

document.querySelectorAll("[data-arg]").forEach((btn) => {
  const id = btn.dataset.arg;
  const count = btn.querySelector("b");
  count.textContent = argVotes[id] || 0;
  btn.addEventListener("click", () => {
    argVotes[id] = (argVotes[id] || 0) + 1;
    count.textContent = argVotes[id];
    save("catdog-args", argVotes);
  });
});

/* ---------- quiz ---------- */
const QUESTIONS = [
  { q: "Your ideal Saturday?", a: [["Cozy blanket, book, nap", "cat"], ["Hike, beach, see friends", "dog"]] },
  { q: "Someone texts 'we need to talk'. You...", a: [["Leave them on read until you're ready", "cat"], ["Call them immediately", "dog"]] },
  { q: "Pick a snack.", a: [["Something fancy and small", "cat"], ["Literally anything, I'm not picky", "dog"]] },
  { q: "At a party you are...", a: [["In the corner, judging silently", "cat"], ["Meeting every single person", "dog"]] },
  { q: "Your room is...", a: [["Exactly how I like it. Don't touch.", "cat"], ["Chaos, but happy chaos", "dog"]] },
];

let quizStep = 0;
let quizScore = { cat: 0, dog: 0 };

function showQuestion() {
  const answers = $("quiz-answers");
  answers.replaceChildren();
  $("quiz-result").replaceChildren();
  $("quiz-restart").hidden = true;

  if (quizStep === QUESTIONS.length) {
    showQuizResult();
    return;
  }

  const { q, a } = QUESTIONS[quizStep];
  $("quiz-progress").textContent = `Question ${quizStep + 1} of ${QUESTIONS.length}`;
  $("quiz-question").textContent = q;
  a.forEach(([text, team]) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = text;
    btn.addEventListener("click", () => {
      quizScore[team]++;
      quizStep++;
      showQuestion();
    });
    answers.append(btn);
  });
}

function showQuizResult() {
  const isCat = quizScore.cat > quizScore.dog;
  const big = document.createElement("span");
  big.className = "big";
  big.textContent = isCat ? "🐱 CAT PERSON 🐱" : "🐶 DOG PERSON 🐶";
  $("quiz-progress").textContent = "Results are in!";
  $("quiz-question").textContent = "";
  $("quiz-result").append(
    big,
    isCat
      ? `You picked cat answers ${quizScore.cat} of ${QUESTIONS.length} times. Independent, discerning, nap-positive.`
      : `You picked dog answers ${quizScore.dog} of ${QUESTIONS.length} times. Loyal, social, always down for a walk.`
  );
  $("quiz-restart").hidden = false;
}

$("quiz-restart").addEventListener("click", () => {
  quizStep = 0;
  quizScore = { cat: 0, dog: 0 };
  showQuestion();
});

showQuestion();

/* ---------- pet-o-meter ---------- */
const pets = load("catdog-pets", { cat: 0, dog: 0 });

function renderPets() {
  $("pets-cat").textContent = pets.cat;
  $("pets-dog").textContent = pets.dog;
  const total = pets.cat + pets.dog;
  let mood = "Nobody has been petted yet. Tragic.";
  if (total) {
    if (pets.cat > pets.dog) mood = "The cat tolerates you. That's basically love. 😼";
    else if (pets.dog > pets.cat) mood = "The dog has decided you are its best friend forever. 🐕💕";
    else mood = "Perfectly balanced, as all things should be. ⚖️";
  }
  $("pet-mood").textContent = mood;
}

function burst(x, y, emoji) {
  const heart = document.createElement("span");
  heart.className = "heart";
  heart.textContent = emoji;
  heart.style.left = x + "px";
  heart.style.top = y + "px";
  document.body.append(heart);
  heart.addEventListener("animationend", () => heart.remove());
}

document.querySelectorAll("[data-pet]").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    const team = btn.dataset.pet;
    pets[team]++;
    save("catdog-pets", pets);
    renderPets();
    // keyboard clicks have no pointer position, so fall back to the button's center
    const rect = btn.getBoundingClientRect();
    burst(e.clientX || rect.left + rect.width / 2, e.clientY || rect.top, team === "cat" ? "💗" : "💙");
  });
});

renderPets();

/* ---------- fact machine ---------- */
const FACTS = {
  cat: [
    "Cats sleep 12 to 16 hours a day.",
    "A group of cats is called a clowder.",
    "Cats can rotate their ears about 180 degrees.",
    "Adult cats mostly meow to talk to humans, not to other cats.",
    "A cat's nose print is unique, like a fingerprint.",
    "Cats can jump up to about six times their body length.",
  ],
  dog: [
    "A dog's sense of smell is tens of thousands of times stronger than ours.",
    "Dogs have about 18 muscles to move their ears.",
    "A dog's nose print is unique, like a fingerprint.",
    "Dogs can learn over 100 words and gestures.",
    "Dogs sweat through their paw pads.",
    "Greyhounds can run about 70 km/h.",
  ],
};
let lastFact = "";

document.querySelectorAll("[data-fact]").forEach((btn) => {
  btn.addEventListener("click", () => {
    const list = FACTS[btn.dataset.fact].filter((f) => f !== lastFact);
    lastFact = list[Math.floor(Math.random() * list.length)];
    $("fact").textContent = lastFact;
  });
});

/* ---------- hot take wall ---------- */
const takes = load("catdog-takes", [
  { text: "Dogs are just cats that believe in themselves.", team: "dog" },
  { text: "A cat walking across your keyboard is a code review.", team: "cat" },
]);

function renderTakes() {
  $("takes").replaceChildren(
    ...takes.map(({ text, team }) => {
      const li = document.createElement("li");
      li.className = team;
      // textContent, never innerHTML: takes are user input
      li.textContent = (team === "cat" ? "🐱 " : "🐶 ") + text;
      return li;
    })
  );
}

$("take-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = $("take-text");
  const text = input.value.trim();
  if (!text) return;
  const team = e.target.elements.team.value === "dog" ? "dog" : "cat";
  takes.unshift({ text: text.slice(0, 120), team });
  takes.length = Math.min(takes.length, 30);
  save("catdog-takes", takes);
  renderTakes();
  input.value = "";
});

renderTakes();

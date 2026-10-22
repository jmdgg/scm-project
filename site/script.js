const KEY = "catdog-votes"
//purposely removing semicolon here

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || { cat: 0, dog: 0 };
  } catch {
    return { cat: 0, dog: 0 };
  }
}

function save(votes) {
  try {
    localStorage.setItem(KEY, JSON.stringify(votes));
  } catch {
    // storage blocked (private mode): votes just won't persist
  }
}

function render(votes) {
  const total = votes.cat + votes.dog;
  const catPct = total ? Math.round((votes.cat / total) * 100) : 50;

  document.getElementById("cat-bar").style.width = catPct + "%";
  document.getElementById("dog-bar").style.width = (100 - catPct) + "%";
  document.getElementById("tally").textContent = total
    ? `Cats: ${votes.cat} (${catPct}%) · Dogs: ${votes.dog} (${100 - catPct}%)`
    : "No votes yet.";

  let verdict = "";
  if (votes.cat > votes.dog) verdict = "Cats are winning! 🐱";
  else if (votes.dog > votes.cat) verdict = "Dogs are winning! 🐶";
  else if (total) verdict = "It's a tie!";
  document.getElementById("verdict").textContent = verdict;
}

let votes = load();
render(votes);

document.querySelectorAll("[data-vote]").forEach((btn) => {
  btn.addEventListener("click", () => {
    votes[btn.dataset.vote]++;
    save(votes);
    render(votes);
  });
});

document.getElementById("reset").addEventListener("click", () => {
  votes = { cat: 0, dog: 0 };
  save(votes);
  render(votes);
});

// Picks the "Champion of the Day" from a date. Pure, so Jest can test it without a browser.
function pickChampion(date) {
  if (date.getDay() === 6) {
    return { team: "cat", message: "🐱 It's Caturday! Cats rule today, no debate." };
  }
  // whole days since 1970 in local time, so the champion flips at local midnight
  const day = Math.floor((date.getTime() - date.getTimezoneOffset() * 60000) / 86400000);
  return day % 2 === 0
    ? { team: "cat", message: "🐱 Today's champion: CATS. Bow to the floof." }
    : { team: "dog", message: "🐶 Today's champion: DOGS. Who's a good champion?" };
}

// Runs once when the page has loaded and shows the banner.
function showChampion() {
  const banner = document.getElementById("champion");
  if (!banner) return;
  const { team, message } = pickChampion(new Date());
  banner.textContent = message;
  banner.classList.add(team);
}

if (typeof module !== "undefined") {
  module.exports = { pickChampion };
} else {
  document.addEventListener("DOMContentLoaded", showChampion);
}

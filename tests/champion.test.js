const { pickChampion } = require("../site/champion.js");

// month is 0-based in Date: 9 = October
test("Saturday is always Caturday", () => {
  expect(pickChampion(new Date(2026, 9, 31))).toEqual({
    team: "cat",
    message: "🐱 It's Caturday! Cats rule today, no debate.",
  });
});

test("weekday champions alternate between cat and dog", () => {
  const monday = pickChampion(new Date(2026, 9, 26)).team;
  const tuesday = pickChampion(new Date(2026, 9, 27)).team;
  expect([monday, tuesday].sort()).toEqual(["cat", "dog"]);
});

test("same day always gives the same champion", () => {
  expect(pickChampion(new Date(2026, 9, 28, 0, 5))).toEqual(pickChampion(new Date(2026, 9, 28, 23, 55)));
});

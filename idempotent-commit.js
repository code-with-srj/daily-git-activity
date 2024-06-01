const simpleGit = require("simple-git");
const moment = require("moment");
const fs = require("fs");

const git = simpleGit();
const startDate = moment("2024-06-01");
const endDate = moment();

async function hasCommitForDate(dateStr) {
  const logs = await git.log({
    "--since": `${dateStr} 00:00`,
    "--until": `${dateStr} 23:59`,
  });
  return logs.total > 0;
}

async function randomCommitsForDay(dateStr, count) {
  for (let i = 0; i < count; i++) {
    fs.appendFileSync("activity.txt", `${dateStr} - commit #${i + 1}\n`);
    await git.add("./*");
    await git.commit(
      `feat: random commit for ${dateStr} #${i + 1}`,
      undefined,
      {
        "--date": `${dateStr} 12:0${i}:00`,
      }
    );
  }
}

(async function () {
  let day = startDate.clone();
  while (day.isSameOrBefore(endDate)) {
    const dateStr = day.format("YYYY-MM-DD");
    const alreadyCommitted = await hasCommitForDate(dateStr);
    if (!alreadyCommitted) {
      const dailyCommits = 1 + Math.floor(Math.random() * 6); // 1 to 6
      await randomCommitsForDay(dateStr, dailyCommits);
      console.log(`Committed for ${dateStr}`);
    } else {
      console.log(`Skipping ${dateStr}, already has commits.`);
    }
    day.add(1, "days");
  }
  await git.push("origin", "main");
})();

const API = require("./Api");
const fs = require("fs");

let links = [];
let stream = fs.createWriteStream("links", { flags: "a" });

async function analyzePopulars(startPage = 1, limit = 1) {
  let maxPage = 0;
  let start = 2;
  if (startPage <= 1) {
    await API.getTvShowsPopular()
      .then(async (res) => {
        maxPage = res.total_pages;
        console.log(`page 1 / ${limit} (maxPage: ${maxPage})`);
        await analyzePage(res.results);
      })
      .then(() => {})
      .catch(() => {
        console.log("getTvShowsPopular() error");
      });
  } else {
    start = startPage;
  }

  for (let i = start; i <= limit; i++) {
    console.log(`page ${i} / ${limit} (maxPage: ${maxPage})`);
    await API.getTvShowsPopular(i)
      .then(async (res) => {
        if (maxPage === 0) {
          maxPage = res.total_pages;
        }
        await analyzePage(res.results);
      })
      .then(() => {})
      .catch(() => {
        console.log("getTvShowsPopular() error");
      });
  }
}

async function analyzePage(tvShows) {
  links = [];
  let tvShowCounter = 0;
  for (tvShow of tvShows) {
    links.push(`https://tracker-daemon.web.app/discover/${tvShow.id}/details`);
    await API.getTvShowDetails(tvShow.id)
      .then(async (tvShowDetails) => {
        for (let season of tvShowDetails.seasons) {
          await API.getTvShowSeason(tvShowDetails.id, season.season_number)
            .then((seasonDetails) => {
              links.push(
                `https://tracker-daemon.web.app/discover/${tvShowDetails.id}/details/season/${season.season_number}`
              );
              for (let episode of seasonDetails.episodes) {
                links.push(
                  `https://tracker-daemon.web.app/discover/${tvShowDetails.id}/details/season/${season.season_number}/episode/${episode.episode_number}`
                );
              }
            })
            .then(() => {
              for (let link of links) {
                stream.write(link + "\n");
              }
              links = [];
            })
            .catch(() => {
              console.log("getTvShowSeason() error");
            });
        }
      })
      .then(() => {})
      .catch(() => {
        console.log("getTvShowDetails() error");
      });
    console.log(`Parsed tvShow ${++tvShowCounter} / ${tvShows.length}`);
  }
}

async function main() {
  // 10 pages = 20 tvShow * 10 pages = first 200 most popular tvShows
  await analyzePopulars(undefined, 10);
  // from 11 to 15 pages
  //await analyzePopulars(11, 15);
  // from 16 to 20 pages
  //await analyzePopulars(16, 20);
  stream.end();
}

main();

const API = require("./Api");
const fs = require("fs");

let links = [];
let stream = fs.createWriteStream("links", { flags: "a" });

async function analyzePopulars() {
  let maxPage = 0;
  await API.getTvShowsPopular()
    .then(async (res) => {
      maxPage = res.total_pages;
      console.log(`page 1 / ` + maxPage);
      await analyzePage(res.results);
    })
    .then(() => {})
    .catch(() => {
      console.log("getTvShowsPopular() error");
    });
  return;
  for (let i = 2; i <= maxPage; i++) {
    console.log(`page ${i} / ` + maxPage);
    await API.getTvShowsPopular(i)
      .then(async (res) => {
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
  for (tvShow of tvShows) {
    links.push(
      `https://master-mwt.github.io/trakd/discover/${tvShow.id}/details`
    );
    await API.getTvShowDetails(tvShow.id)
      .then(async (tvShowDetails) => {
        for (let season of tvShowDetails.seasons) {
          await API.getTvShowSeason(tvShowDetails.id, season.season_number)
            .then((seasonDetails) => {
              links.push(
                `https://master-mwt.github.io/trakd/discover/${tvShowDetails.id}/details/season/${season.season_number}`
              );
              for (let episode of seasonDetails.episodes) {
                links.push(
                  `https://master-mwt.github.io/trakd/discover/${tvShowDetails.id}/details/season/${season.season_number}/episode/${episode.id}`
                );
              }
            })
            .then(() => {
              for (let link of links) {
                stream.write(link + "\n");
              }
              console.log(links.length);
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
  }
}

async function main() {
  stream.write("https://master-mwt.github.io/trakd/" + "\n");
  stream.write("https://master-mwt.github.io/trakd/explore/popular" + "\n");
  stream.write("https://master-mwt.github.io/trakd/explore/top_rated" + "\n");
  stream.write("https://master-mwt.github.io/trakd/search" + "\n");
  stream.write("https://master-mwt.github.io/trakd/genres" + "\n");
  stream.write("https://master-mwt.github.io/trakd/collection" + "\n");
  stream.write("https://master-mwt.github.io/trakd/backup" + "\n");
  await analyzePopulars();
  stream.end();
}

main();

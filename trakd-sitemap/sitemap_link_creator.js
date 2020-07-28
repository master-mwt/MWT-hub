let API = require("./Api");
let fs = require("fs");

let links = [];

async function analyzePopulars() {
  let maxPage = 0;
  await API.getTvShowsPopular()
    .then(async (res) => {
      maxPage = res.total_pages;
      console.log(`maxPage = ${maxPage}`);
      await analyzePage(res.results);
    })
    .then(() => {
      console.log(`page 1 analyzed`);
    })
    .catch(() => {
      console.log("getTvShowsPopular() error");
    });

  for (let i = 2; i <= maxPage; i++) {
    await API.getTvShowsPopular(i)
      .then(async (res) => {
        await analyzePage(res.results);
      })
      .then(() => {
        console.log(`page ${i} analyzed`);
      })
      .catch(() => {
        console.log("getTvShowsPopular() error");
      });
  }
}

async function analyzePage(tvShows) {
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
              console.log(
                "getTvShowSeason() tvshow " +
                  tvShowDetails.id +
                  " season " +
                  season.season_number +
                  " finished"
              );
            })
            .catch(() => {
              console.log("getTvShowSeason() error");
            });
        }
      })
      .then(() => {
        console.log("getTvShowDetails() tvshow " + tvShow.id + " finished");
      })
      .catch(() => {
        console.log("getTvShowDetails() error");
      });
  }
}

async function main() {
  console.log("** link discovering **");
  await analyzePopulars();
  console.log("** link discover finished **");
  console.log("-- write links started --");
  let stream = fs.createWriteStream("links", { flags: "a" });
  stream.write("https://master-mwt.github.io/trakd/" + "\n");
  stream.write("https://master-mwt.github.io/trakd/explore/popular" + "\n");
  stream.write("https://master-mwt.github.io/trakd/explore/top_rated" + "\n");
  stream.write("https://master-mwt.github.io/trakd/search" + "\n");
  stream.write("https://master-mwt.github.io/trakd/genres" + "\n");
  stream.write("https://master-mwt.github.io/trakd/collection" + "\n");
  stream.write("https://master-mwt.github.io/trakd/backup" + "\n");
  for (let link of links) {
    stream.write(link + "\n");
  }
  stream.end();
  console.log("-- write links finished --");
}

main();

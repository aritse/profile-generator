const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("pdfcrowd");
const fs = require("fs");
const util = require("util");
const html = require("./generate");

const writeToFileAsync = util.promisify(fs.writeFile);

const questions = [
  { type: "input", name: "username", message: "What is your GitHub username?" },
  { type: "list", name: "color", message: "Please choose a color", choices: ["red", "green", "blue", "pink"] }
];

async function init() {
  try {
    const { username, color } = await inquirer.prompt(questions);
    const { data } = await axios.get(`https://api.github.com/users/${username}`);
    const dev = (({ avatar_url, html_url, name, public_repos, company, blog, location, bio, following, followers }) => ({
      avatar_url,
      html_url,
      name,
      public_repos,
      company,
      blog,
      location,
      bio,
      following,
      followers
    }))(data);
    dev.color = color;

    const url = data.starred_url.replace("{/owner}{/repo}", "");
    const response = await axios.get(url);
    dev.stars = response.data.length;

    await writeToFileAsync("profile.html", html.generate(dev));

    const client = new pdf.HtmlToPdfClient("aritse", "c3cba596346b713632a35be017708a44");
    client.convertFileToFile("profile.html", "profile.pdf", error => {
      if (error) throw error;
      console.log("created profile.pdf");
    });
  } catch (error) {
    console.log(error);
  }
}

const dev = {
  username: "",
  color: "",
  repositories: 0,
  image: "",
  github: "",
  followers: -1,
  following: -1,
  stars: -1
};

init();

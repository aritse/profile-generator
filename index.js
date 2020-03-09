const inquirer = require("inquirer");
const axios = require("axios");
const pdf = require("html-pdf");
const fs = require("fs");
const util = require("util");
const html = require("./generate");

const writeFileAsync = util.promisify(fs.writeFile);

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

    const response = await axios.get(data.starred_url.replace("{/owner}{/repo}", ""));
    dev.stars = response.data.length;

    const profile = html.generate(dev);
    await writeFileAsync("profile.html", profile, "utf8");
    const options = { format: "Letter" };

    pdf.create(profile, options).toFile("profile.pdf", (error, response) => {
      if (error) throw error;
      console.log(response);
    });
  } catch (error) {
    console.log(error);
  }
}

init();

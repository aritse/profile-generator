const inquirer = require("inquirer");
const axios = require("axios");
const html = require("./generate");
const fs = require("fs");

const questions = [
  { type: "input", name: "username", message: "What is your GitHub username?" },
  { type: "list", name: "color", message: "Please choose a color", choices: ["red"] }
];

let response;

async function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, error => {
    if (error) throw error;
    console.log("created", fileName);
  });
}

async function init() {
  try {
    const answers = await inquirer.prompt(questions);
    dev.username = answers.username;
    dev.color = answers.color;

    response = await axios.get(`https://api.github.com/users/${dev.username}/repos?per_page=100`);
    dev.repositories = response.data.length;
    const owner = response.data[0].owner;
    dev.image = owner.avatar_url;
    dev.github = owner.html_url;

    response = await axios.get(owner.followers_url);
    dev.followers = response.data.length;

    response = await axios.get(owner.following_url.replace(/{\/other_user}/, ""));
    dev.following = response.data.length;

    response = await axios.get(owner.starred_url.replace(/{\/owner}{\/repo}/, ""));
    dev.stars = response.data.length;

    console.log(dev);

    writeToFile("profile.html", html.generate(dev));
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

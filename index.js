const inquirer = require("inquirer");
const axios = require("axios");
const gen = require("./generateHTML");
const fs = require("fs");

const questions = [
  { type: "input", name: "username", message: "What is your GitHub username?" },
  { type: "list", name: "color", message: "Please choose a color", choices: ["red"] }
];

async function writeToFile(fileName, data) {
  fs.writeFile(fileName, data, error => {
    if (error) throw error;
    console.log("created", fileName);
  });
}

async function init() {
  try {
    const answers = await inquirer.prompt(questions);
    info.username = answers.username; // username
    info.color = answers.color; // color
    const githubUrl = `https://api.github.com/users/${info.username}/repos?per_page=100`;
    let response = await axios.get(githubUrl);
    info.repositories = response.data.length; // number of repositories
    const owner = response.data[0].owner;
    info.image = owner.avatar_url; // image
    info.github = owner.html_url; // GitHub URL
    response = await axios.get(owner.followers_url);
    info.followers = response.data.length; // number of followers
    const followingUrl = owner.following_url.replace(/{\/other_user}/, "");
    response = await axios.get(followingUrl);
    info.following = response.data.length; // number of repositories following
    const starsUrl = owner.starred_url.replace(/{\/owner}{\/repo}/, "");
    response = await axios.get(starsUrl);
    info.stars = response.data.length; // number of stars
    console.log(info);
    const html = gen.generateHTML(info);
    writeToFile("profile.html", html);
  } catch (error) {
    console.log(error);
  }
}

const info = {
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

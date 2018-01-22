const fs = require("fs");
const path = require("path");
const axios = require("axios");
const api = "https://api.github.com/";

let json = [];

const usernames = require("./usernames.json");

const fetchUser = username => {
  return axios.get(api + "users/" + username);
};

const addToJson = dataObject => {
  const temp = [...json];
  const uniquearray = temp.filter(a => a.url !== dataObject.url);
  uniquearray.push(dataObject);
  json = uniquearray;
};

const writeToFile = () => {
  fs.writeFile("main.json", JSON.stringify(json, null, 2), err => {
    if (err) {
      console.log(err);
    }
    console.log("Added to File");
    return;
  });
};

const main = () => {
  usernames.alumini.forEach(user => {
    const a = {};
    fetchUser(user)
      .then(res => {
        a.avatar = res.data.avatar_url;
        a.name = res.data.name;
        a.url = res.data.html_url;
        a.currentMember = false;
        a.position = "";
        a.description = "";
        addToJson(a);
        writeToFile();
      })
      .catch(err => {
        if (err) {
          console.error(err.response.data.message);
        }
      });
  });
  usernames.currentTeam.forEach(user => {
    const a = {};
    fetchUser(user)
      .then(res => {
        a.avatar = res.data.avatar_url;
        a.name = res.data.name;
        a.url = res.data.html_url;
        a.currentMember = true;
        a.position = "";
        a.description = "";
        addToJson(a);
        writeToFile();
      })
      .catch(err => {
        if (err) {
          console.error(err.response.data.message);
        }
      });
  });
};

main();

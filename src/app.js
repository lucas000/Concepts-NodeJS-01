const express = require("express");
const cors = require("cors");
const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

function validateLikeIDIsUuid(request, response, next) {
  const { id } = request.params;

  if(!isUuid(id)) {
    return response.status(400).json({ error: 'Invalid repositorie ID'});
  }

  return next();
};

app.use(['/repositories/:id', '/repositories/:id', '/repositories/:id/like'], 
  validateLikeIDIsUuid);

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const repositorie = {
    id: uuid(),
    title,
    url,
    techs,
    "likes": 0
  };

  repositories.push(repositorie)

  return response.json(repositorie);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositorieIndex = repositories.findIndex(
    repositorie => repositorie.id === id );

  if(repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found"});
  }

  let repositorie = repositories[repositorieIndex];

  repositorie = {
    id,
    title,
    url,
    techs,
    "likes": repositories[repositorieIndex].likes
  };

  repositories[repositorieIndex] = repositorie;

  return response.json(repositories[repositorieIndex]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    repositorie => repositorie.id === id );

  if(repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found"});
  }

  repositories.splice(repositorieIndex, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repositorieIndex = repositories.findIndex(
    repositorie => repositorie.id === id);

  if(repositorieIndex < 0) {
    return response.status(400).json({ error: "Repositorie not found"});
  }
  
  repositories[repositorieIndex].likes++;

  return response.json(repositories[repositorieIndex]);
});

module.exports = app;

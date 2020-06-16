const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());

function validateFormatUid(request, response, next) {
  const { id } = request.params

  if(!isUuid(id))
    return response.status(400).json({ err: 'Invalid format Id!'})

  return next()
}

app.use("/repositories/:id", validateFormatUid)

const repositories = [];
const likes = [];

app.get("/repositories", (request, response) => {
  const repositoryLike = repositories
    .map(repository => {
      const count = likes.filter(like => like.id === repository.id)
      return {...repository, likes: count.length}
    })
    
  return response.json(repositoryLike)
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body
  
  const newRepository = { id: uuid(), title, url, techs, likes: 0 }
  repositories.push(newRepository)

  return response.json(newRepository)
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params
  const { title, url, techs } = request.body

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if(repositoryIndex < 0)
    return response.status(400).json({err: 'Id not found!'})

  const updateRepository = {
    ...repositories[repositoryIndex],
    title, url, techs
  }

  repositories[repositoryIndex] = updateRepository

  return response.json(updateRepository)
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repo => repo.id === id)

  if(repositoryIndex < 0)
    return response.status(400).json({ err: 'Id not found!' })

    repositories.splice(repositoryIndex, 1)

  return response.status(204).send()
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params

  const repositoryIndex = repositories.findIndex(repository => (repository.id === id))

  if(repositoryIndex < 0){
    return response.status(404).json({err: 'Id not found!'})
  }

  like = { id: id, likes: 1}
  likes.push(like)

  const countLikes = likes.filter(like => like.id === id).length

  const repositoryLikes = {
    ...repositories[repositoryIndex],
    likes: countLikes  
  }

  repositories[repositoryIndex] = repositoryLikes

  return response.json(repositoryLikes)
});

module.exports = app;

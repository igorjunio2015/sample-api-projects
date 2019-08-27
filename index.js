const express = require("express");
const server = express();
server.use(express.json());
server.listen(3939);

let numberOfRequests = 0;
const projects = [];

function checkIndexTaskExist(req, res, next) {
  const { id } = req.params;
  const { index } = req.body;
  const project = projects.find(p => p.id == id);
  if (!project.tasks[index]) {
    return res.status(400).json({ error: "Task not found" });
  }
  return next();
}

function checkProjectExist(req, res, next) {
  const { id } = req.params;
  const project = projects.find(p => p.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

function checkIdProject(req, res, next) {
  const { id } = req.body;
  if (!id) {
    return res.status(400).json({ error: "Id is required" });
  }
  return next();
}

function checkTitleProject(req, res, next) {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: "Title is required" });
  }
  return next();
}

function logRequests(req, res, next) {
  numberOfRequests++;
  console.log(`Número de requisições: ${numberOfRequests}`);
  return next();
}

server.use(logRequests);

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.post("/projects", checkIdProject, checkTitleProject, (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

server.put(
  "/projects/:id",
  checkProjectExist,
  checkTitleProject,
  (req, res) => {
    const { id } = req.params;
    const { title } = req.body;
    const project = projects.find(p => p.id == id);
    project.title = title;
    return res.json(project);
  }
);

server.put(
  "/projects/:id/tasks",
  checkProjectExist,
  checkIndexTaskExist,
  checkTitleProject,
  (req, res) => {
    const { id } = req.params;
    const { index, title } = req.body;
    const project = projects.find(p => p.id == id);
    project.tasks[index].title = title;
    console.log(project);
    return res.json(project);
  }
);

server.delete("/projects/:id", checkProjectExist, (req, res) => {
  const { id } = req.params;
  const projectIndex = projects.findIndex(p => p.id == id);
  projects.splice(projectIndex, 1);
  return res.send();
});

server.post(
  "/projects/:id/tasks",
  checkProjectExist,
  checkTitleProject,
  (req, res) => {
    const { id } = req.params;
    const { idTask, title } = req.body;
    const project = projects.find(p => p.id == id);
    project.tasks.push({ idTask, title });
    return res.json(project);
  }
);

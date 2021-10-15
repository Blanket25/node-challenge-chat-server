const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());

const welcomeMessage = {
  id: 0,
  from: "Bart",
  text: "Welcome to CYF chat system!",
};

//This array is our "data store".
//We will start with one message in the array.
//Note: messages will be lost when Glitch restarts our server.
const messages = [welcomeMessage];

const getAllMessages = (request, response) => {
  response.send(messages);
};

const getMessageById = (request, response) => {
  const id = parseInt(request.params.id);
  const foundMessage = messages.find((m) => m.id === id);
  foundMessage
    ? response.send(foundMessage)
    : response.status(400).send("No message found");
};

const createNewMessage = (request, response) => {
  const newMessage = request.body;

  if (newMessage.text === "" || newMessage.from === "") {
    response.status(400);
  }

  const maxId = Math.max(...messages.map((m) => m.id));
  newMessage.id = maxId + 1;
  messages.push(newMessage);
  response.send(newMessage);
};

const deleteMessage = (request, response) => {
  const id = parseInt(request.params.id);
  const foundMessage = messages.find((m) => m.id === id);
  const foundMessageIndex = messages.indexOf(foundMessage);
  const deletedMessage = messages.splice(foundMessageIndex, 1);
  response.send(deletedMessage);
};

app.use(express.json); //es necesario si recolecto la info de un arr?
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
});
app.get("/messages", getAllMessages);
app.get("/messages/:id", getMessageById);
app.post("/messages", createNewMessage);
app.delete("/messages/:id", deleteMessage);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

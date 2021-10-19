const express = require("express");
const cors = require("cors");

const app = express();
const fs = require("fs");
const messages = require("./messages.json");

app.use(cors());

const saveToJson = (messages) => {
  const text = JSON.stringify(messages, null, 4);
  fs.writeFileSync("./messages.json", text);
};

const getMessages = (request, response) => {
  const limit = request.query.limit || messages.length;
  const page = request.query.page || 1;

  let lastMessages = messages.slice(
    (page - 1) * limit,
    (page - 1) * limit + limit
  );
  response.send(lastMessages);
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

  if (
    !newMessage.text ||
    newMessage.text.trim().length === 0 ||
    !newMessage.from ||
    newMessage.from.trim().length === 0
  ) {
    response.status(400).send("Please put the required information");
  } else {
    const maxId = Math.max(...messages.map((m) => m.id));
    newMessage.id = maxId + 1;
    messages.push(newMessage);
    saveToJson(messages);
    response.send(newMessage);
  }
};

const deleteMessage = (request, response) => {
  const id = parseInt(request.params.id);
  const foundMessage = messages.find((m) => m.id === id);
  const foundMessageIndex = messages.indexOf(foundMessage);
  const deletedMessage = messages.splice(foundMessageIndex, 1);
  saveToJson(messages);
  response.send(deletedMessage);
};

const searchMessage = (request, response) => {
  const text = request.query.text;

  const filteredMessages = messages.filter((m) => m.text.includes(text));

  filteredMessages.length > 0
    ? response.send(filteredMessages)
    : response.status(404).send("No messages found");
};

app.use(express.json());
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
}); //y esto q es??
app.get("/messages", getMessages);
app.get("/messages/search", searchMessage);
app.post("/messages", createNewMessage);
app.delete("/messages/:id", deleteMessage);
app.get("/messages/:id", getMessageById);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

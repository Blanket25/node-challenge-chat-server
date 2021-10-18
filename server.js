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
    //not working
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

const searchMessage = (request, response) => {
  const text = request.query.text;

  const filteredMessages = messages.filter((m) => m.text.includes(text));

  filteredMessages.length > 0
    ? response.send(filteredMessages)
    : response.status(404).send("No messages found");
};

const getTenRecent = (request, response) => {
  let lastTen = messages.slice(-10);
  response.send(lastTen);
};

const getThreeRecent = (request, response) => {
  let lastThree = messages.slice(-3);
  response.send(lastThree);
};

app.use(express.json());
app.get("/", function (request, response) {
  response.sendFile(__dirname + "/index.html");
}); //y esto q es??
app.get("/messages", getAllMessages);
app.get("/messages/search", searchMessage);
app.get("/messages/last-three", getThreeRecent);
app.get("/messages/latest", getTenRecent);
app.post("/messages", createNewMessage);
app.delete("/messages/:id", deleteMessage);
app.get("/messages/:id", getMessageById);

app.listen(3000, () => {
  console.log("Listening on port 3000");
});

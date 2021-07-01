const chatForm = document.getElementById('chat-form');
const your_score =document.getElementById('your_score')
const their_score =document.getElementById('their_score')
const timer =document.getElementById('timer')

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chatroom
socket.emit('joinRoom', { username, room });

// Message from server
socket.on('message', (other) => {
  console.log('Message')
  console.log(other);
  const yourScore=other.userList.find(usr => usr.id == socket.id)
  const otherUser = 1- other.userList.findIndex(usr => usr.id === socket.id);
  your_score.innerHTML = yourScore.score;
  their_score.innerHTML = other.userList[otherUser].score
});


document.addEventListener('click', function() {
  console.log("Click")
  socket.emit('increment');
});

// var seconds = 30;
// setInterval(function() {
// timer.innerHTML = seconds--;
// }, 30000);


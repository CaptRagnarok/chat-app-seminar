// Connects to your Scaledrone channel
// Scaledrone constructor takes the CLIENT ID and data for a new user

const CLIENT_ID = 'SvKe8brTvD9tOzJQ';
const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    // Will be sent out as clientData via events
    name: localStorage.getItem('name') || '',
    color: getRandomColor(),
  },
});

const logoutButton = document.querySelector('.logout-button');

logoutButton.addEventListener('click', function () {
  localStorage.removeItem('name');

  window.location.href = './index.html';
});

// ------------------------------------------

// Keeps track of current online users
let members = [];

// ------------------------------------------

// Configures the Scaledrone chatroom

// Posts a successful connection, unless there is an error

drone.on('open', (error) => {
  if (error) {
    return console.error(error);
  }
  console.log('Successfully connected to Scaledrone');

  const room = drone.subscribe('observable-room');
  room.on('open', (error) => {
    if (error) {
      return console.error(error);
    }
    console.log('Successfully joined room');
  });

  room.on('members', (m) => {
    members = m;
    updateMembersDOM();
  });

  room.on('member_join', (member) => {
    members.push(member);
    updateMembersDOM();
  });

  room.on('member_leave', ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    members.splice(index, 1);
    updateMembersDOM();
  });

  room.on('data', (text, member) => {
    if (member) {
      addMessageToListDOM(text, member);
    } else {
      // Message is from server
    }
  });
});

drone.on('close', (event) => {
  console.log('Connection was closed', event);
});

drone.on('error', (error) => {
  console.error(error);
});

// this one returns a random color hex
function getRandomColor() {
  return '#' + Math.floor(Math.random() * 0xffffff).toString(16);
}

//----------------------------------
//------------- DOM STUFF----------|
//----------------------------------

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

DOM.form.addEventListener('submit', sendMessage);

function sendMessage() {
  const value = DOM.input.value;
  if (value === '') {
    return;
  }
  DOM.input.value = '';
  drone.publish({
    room: 'observable-room',
    message: value,
  });
}

function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

function updateMembersDOM() {
  //how many users in room
  DOM.membersCount.innerText = `Online: ${members.length}`;
  DOM.membersList.innerHTML = '';
  members.forEach((member) =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}

function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.appendChild(createMemberElement(member));

  // emoji support
  const textWithEmojis = replaceEmojisWithUnicode(text);
  el.appendChild(document.createTextNode(textWithEmojis));

  // differentiate from current user
  if (member.id === drone.clientId) {
    el.className = 'current-user-message message';
  } else {
    el.className = 'message';
  }
  console.log('MemberID: ', member.id);
  console.log('ClientID: ', drone.clientId);

  return el;
}

function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  el.appendChild(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}

//----------------------------------
//---------- EMOJI SUPPORT---------|
//----------------------------------
function replaceEmojisWithUnicode(text) {
  // Define a map of emoji replacements
  const emojiMap = {
    ':)': '\u{1F642}',
    ':D': '\u{1F600}',
    '<3': '\u{1F497}',
    '</3': '\u{1F494}',
    '8D': '\u{1F576}',
    '/XD': '\u{1F602}',
    '/XXD': '\u{1F923}',
    ':thumbsup:': '\u{1F44D}',
    ':thumbsdown:': '\u{1F44E}',
    ':flex:': '\u{1F4AA}',
    // Add more emoji replacements as needed
  };

  // Replace emojis in the text
  let replacedText = text;
  Object.keys(emojiMap).forEach((emoji) => {
    replacedText = replacedText.replace(
      new RegExp(escapeRegExp(emoji), 'g'),
      emojiMap[emoji]
    );
  });

  return replacedText;
}

// Helper function to escape regular expression characters
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// AUTOMATED EMOJI PICKER
//-*---------------------------

// defines emoji picker button and div
const emojiPickerBtn = document.getElementById('emoji-picker-btn');
const emojiPicker = document.getElementById('emoji-picker');

// handles opening and closing the picker div
emojiPickerBtn.addEventListener('click', () => {
  const emojiPickerDisplay = getComputedStyle(emojiPicker).display;
  emojiPicker.style.display = emojiPickerDisplay === 'none' ? 'flex' : 'none';
});

// inserts the selected emoji into the message input
emojiPicker.addEventListener('click', (event) => {
  const emoji = event.target.textContent;
  if (emoji) {
    insertEmoji(emoji);
    emojiPicker.style.display = 'none';
  }
});

// closes the emoji picker if you click anywhere else
document.addEventListener('click', (event) => {
  const isEmojiPickerClicked = emojiPicker.contains(event.target);
  const isEmojiButtonClicked = emojiPickerBtn.contains(event.target);
  if (!isEmojiPickerClicked && !isEmojiButtonClicked) {
    emojiPicker.style.display = 'none';
  }
});

// function that handles emoji insertion
function insertEmoji(emoji) {
  const input = DOM.input;
  const cursorPosition = input.selectionStart;
  const value = input.value;
  const newValue =
    value.slice(0, cursorPosition) + emoji + value.slice(cursorPosition);
  input.value = newValue;
}

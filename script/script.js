//--------------------
// INITIALIZATION
//--------------------
// Connects to your Scaledrone channel
// Scaledrone constructor takes the CLIENT ID and data for a new user

const CLIENT_ID = 'SvKe8brTvD9tOzJQ';

//--------------------
// REDIRECT AREA

// Check if the user went through the login process
// If accessing /chatapp.html directly, redirect to login screen

let name = localStorage.getItem('name') || '';
if (name === '') {
  window.location.href = './index.html';
}

//---------------------------
// SCALEDRONE CHATROOM SETUP

// Initial user and members setup

const drone = new ScaleDrone(CLIENT_ID, {
  data: {
    // Will be sent out as clientData via events
    name: localStorage.getItem('name') || '',
    // color: getRandomColor(),
    color: '#e6e6e6',
  },
});

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
    // Added user "join" message
    displayStatusMessage(`${member.clientData.name} has joined the chat.`);
  });

  room.on('member_leave', ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    if (index !== -1) {
      const member = members[index];
      members.splice(index, 1);
      updateMembersDOM();
      // Added user "leave" message
      displayStatusMessage(`${member.clientData.name} has left the chat.`);
    }
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

//----------------------
// LOGOUT FUNCTIONALITY

const logoutButton = document.querySelector('.logout-button');

logoutButton.addEventListener('click', function () {
  localStorage.removeItem('name');

  window.location.href = './index.html';
});

//----------------------------------
// DOM - MESSAGES AND MEMBERS
//----------------------------------

const DOM = {
  membersCount: document.querySelector('.members-count'),
  membersList: document.querySelector('.members-list'),
  messages: document.querySelector('.messages'),
  input: document.querySelector('.message-form__input'),
  form: document.querySelector('.message-form'),
};

// Adds messages to DOM

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

// Creates Members in "online-section"
function createMemberElement(member) {
  const { name, color } = member.clientData;
  const el = document.createElement('div');
  el.appendChild(document.createTextNode(name));
  el.className = 'member';
  el.style.color = color;
  return el;
}

// Updates "Online" counter
function updateMembersDOM() {
  //how many users in room (ONLINE)
  DOM.membersCount.innerText = `${members.length}`;
  DOM.membersList.innerHTML = '';
  members.forEach((member) =>
    DOM.membersList.appendChild(createMemberElement(member))
  );
}
// Creates messages (message, my-message)
function createMessageElement(text, member) {
  const el = document.createElement('div');
  el.className = 'message';

  // Gives different class to current user, and other user
  if (member.id === drone.clientId) {
    el.className = 'my-message';
  }
  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.innerHTML = replaceEmojisWithUnicode(text); // Replaces defined text with emojis

  // Handles message timestamp
  const timestamp = document.createElement('div');
  timestamp.className = 'message-timestamp';
  timestamp.textContent = getCurrentTimestamp();

  el.appendChild(createMemberElement(member));
  el.appendChild(messageContent);
  el.appendChild(timestamp);

  return el;
}

// controls the timestamp in messages
function getCurrentTimestamp() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

// Pushes messages to DOM
function addMessageToListDOM(text, member) {
  const el = DOM.messages;
  const wasTop = el.scrollTop === el.scrollHeight - el.clientHeight;
  // Using prepend because flex-end doesn't work with overflow:scroll, so this helps with layout issues
  el.prepend(createMessageElement(text, member));
  if (wasTop) {
    el.scrollTop = el.scrollHeight - el.clientHeight;
  }
}

// Handles "user has joined/left the chat" messages
function displayStatusMessage(message) {
  const el = document.createElement('div');
  el.textContent = message;
  el.className = 'status-message';
  DOM.messages.prepend(el);
  DOM.messages.scrollTop = DOM.messages.scrollHeight;
}
//----------------------
// DEBUG AREA
// messageContent.appendChild(document.createTextNode(text)); SEEMS LIKE I DON'T NEED THIS ANYMORE

// el.appendChild(document.createTextNode(textWithEmojis)); THIS MADE DOUBLE TEXT

// checks for IDs, only for testing purposes

// console.log('MemberID: ', member.id);
// console.log('ClientID: ', drone.clientId);
//------------------------------------------------------

//----------------------
// DOM - EMOJI SUPPORT
//----------------------

function replaceEmojisWithUnicode(text) {
  // Define a map of emoji replacements
  const emojiMap = {
    ':)': '\u{1F642}',
    ':D': '\u{1F600}',
    '<3': '\u{1F497}',
    '</3': '\u{1F494}',
    '8D': '\u{1F576}',
    '/XD': '\u{1F602}', // fix escape characters for X
    '/XXD': '\u{1F923}',
    ':thumbsup:': '\u{1F44D}',
    ':thumbsdown:': '\u{1F44E}',
    ':flex:': '\u{1F4AA}',
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
//---------------------
// DOM - EMOJI PICKER
//---------------------

// defines emoji picker button and div
const emojiPickerBtn = document.getElementById('emoji-picker-btn');
const emojiPicker = document.getElementById('emoji-picker');

// handles opening and closing the picker div
emojiPickerBtn.addEventListener('click', () => {
  emojiPicker.classList.toggle('visible');
  // const emojiPickerDisplay = getComputedStyle(emojiPicker).display;
  // emojiPicker.style.display = emojiPickerDisplay === 'none' ? 'flex' : 'none';
});

// inserts the selected emoji into the message input
emojiPicker.addEventListener('click', (event) => {
  const emoji = event.target.textContent;
  if (emoji) {
    insertEmoji(emoji);

    //refocuses on input field
    DOM.input.focus();
  }
});

// closes the emoji picker if you click anywhere else
document.addEventListener('click', (event) => {
  const isEmojiPickerClicked = emojiPicker.contains(event.target);
  const isEmojiButtonClicked = emojiPickerBtn.contains(event.target);

  if (!isEmojiPickerClicked && !isEmojiButtonClicked) {
    emojiPicker.classList.remove('visible');
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
//-----------------------------
// SIDEBAR FUNCTIONALITY
//-----------------------------
const hamburger = document.querySelector('.hamburger-input');
const hamburger2 = document.querySelector('.hamburger-sidebar');
const onlineSection = document.querySelector('.online-section');

let menuOpen = false;

function openMenu() {
  menuOpen = true;
  onlineSection.style.width = '60%';
}

function closeMenu() {
  menuOpen = false;
  onlineSection.style.width = '0';
}

hamburger.addEventListener('click', function () {
  if (!menuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
});
hamburger2.addEventListener('click', function () {
  if (!menuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
});

// CODE IN PROGRESS, NEED TO MAKE DOM CLOSE ONLINE SECTION WHEN CLICKING ANYWHERE ELSE, BUT ONLY ON SMALL SCREENS
// function handleDocumentClick(event) {
//   const target = event.target;
//   const isOnlineSection = onlineSection.contains(target);
//   const isHamburger = hamburger.contains(target);

//   if (!isOnlineSection && !isHamburger) {
//     closeMenu();
//   }
// }

// document.addEventListener('click', handleDocumentClick); // closes sidebar when you click anywhere, but needs more work

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
    displayStatusMessage(`${member.clientData.name} has joined the chat.`);
  });

  room.on('member_leave', ({ id }) => {
    const index = members.findIndex((member) => member.id === id);
    if (index !== -1) {
      const member = members[index];
      members.splice(index, 1);
      updateMembersDOM();
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
  el.className = 'message';

  const messageContent = document.createElement('div');
  messageContent.className = 'message-content';
  messageContent.innerHTML = replaceEmojisWithUnicode(text);

  const timestamp = document.createElement('div');
  timestamp.className = 'message-timestamp';
  timestamp.textContent = getCurrentTimestamp();

  el.appendChild(createMemberElement(member));
  el.appendChild(messageContent);
  el.appendChild(timestamp);
  // messageContent.appendChild(document.createTextNode(text)); SEEMS LIKE I DON'T NEED THIS ANYMORE

  // differentiate from current user
  if (member.id === drone.clientId) {
    el.className = 'my-message';
  }

  // el.appendChild(document.createTextNode(textWithEmojis)); THIS MADE DOUBLE TEXT

  // checks for IDs, only for testing purposes

  // console.log('MemberID: ', member.id);
  // console.log('ClientID: ', drone.clientId);

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

// function for "user has joined/left the chat"
function displayStatusMessage(message) {
  const el = document.createElement('div');
  el.textContent = message;
  el.className = 'status-message';
  DOM.messages.appendChild(el);
  DOM.messages.scrollTop = DOM.messages.scrollHeight;
}

// controls the timestamp in messages
function getCurrentTimestamp() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
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
//-----------------------------
// AUTOMATED EMOJI PICKER
//-----------------------------

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

    //refocuses on input field
    DOM.input.focus();
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
//-----------------------------
// SIDEBAR FUNCTIONALITY
//-----------------------------
const hamburger = document.querySelector('.font-awesome');
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

function handleDocumentClick(event) {
  const target = event.target;
  const isOnlineSection = onlineSection.contains(target);
  const isHamburger = hamburger.contains(target);

  if (!isOnlineSection && !isHamburger) {
    closeMenu();
  }
}

hamburger.addEventListener('click', function () {
  if (!menuOpen) {
    openMenu();
  } else {
    closeMenu();
  }
});
document.addEventListener('click', handleDocumentClick);

# Chat app - Seminar Work

## Overview

This is a chat application created as seminar work for the _Algebra učilište_ **Front-end course**.

Designed to be a working chat app using the _Scaledrone API_ for functionality.

## Changelog

### 0.6.0

- Final (hopefully) layout fixes
- "Message" area now supports scrolling
- Chat input area cannot be scrolled under the virtual keyboard when using phones and tablets

### 0.5.2

- Layout fixes

### 0.5.1

- Chats now start at the bottom of the screen
- Small bugfixes

### 0.5.0

- Added colapsible sidebar support for the mobile version
- Futher code cleanup required

### 0.4.2

- Initialized final layout (basic level for Desktop)
- Small code cleanup in scss

### 0.4.1

- Added info messages when a member enters/leaves chat.
- Added timestamp to chat messages
- Other users now also have a chat color

### 0.4.0

- Current chat users will now have a different color from the rest of the chat participants
- Added emoji support
  - Can be accessed via it's own button box
  - Can also be accessed by typing in most common emoji text ("smileyface", :flex:, :thumbsup:, etc.)

### 0.3.6

- Added this readme

### 0.3.5

- Further name changes for readability
  style.scss > chatapp.scss
  \_color.scss > \_variables.scss
- Added a meme when not entering a name when pressing the "Enter chatroom" button
- Further optimized @media queries for most popular mobile screen widths

### 0.3.4

- Fixed mobile layout centering

### 0.3.3

- Added a test commit with border debugging to check why layout is not centered on mobile sized screens

### 0.3.2

- Added responsive layout for the login page

### 0.3.1

- Chat name is now a required attribute

### 0.3.0

- SCSS structure initialized
  Transferred all CSS into SCSS
  Divided code into two scss files for the login page and chatapp page
  Further divided certain code into extends (variables, reset, mixins)

### 0.2.1

- Updated folder naming structure
  login.html > index.html
  index.html > chatapp.html

### 0.2.0

- Added a login screen
- Updated js and combined functionality with chatapp.

### 0.1.0

- Original upload, Scaledrone functionality set up.

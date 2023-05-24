# Chat app - Seminar Work

## Overview

This is a chat application created as seminar work for the _Algebra učilište_ **Front-end course**.

Designed to be a working chat app using the _Scaledrone API_ for functionality.

## Changelog

### 0.9.4

- Cleaned code up further
  - Removed manually added vendor prefixes
  - Live Sass Compiler now adds vendor prefixes automatically on compilation

### 0.9.3

- Forgot to include \_prefixes, fixed

### 0.9.1/2

- More vendor prefixes (login)

### 0.9.0

- CSS code cleanup
- Added vendor prefixes

### 0.8.2

- HTML, js code cleanup, #2

### 0.8.1

- Code cleanup, #1

### 0.8.0

- Fixed various layout issues

  - Sidebar margins and width
  - Icon size
  - Message max width on large screens
  - Border bleeding issues when they should be invisible

- Sidebar can now be closed by clicking anywhere else (on mobile)

- Fixed bug where pressing emoji picker inserts all emoji at once

- Yet to be done:
  - Font sizes, weight and some colors
  - Fine-tuning final colors
  - Code cleanup and optimization

### 0.7.0

- Color pallete updated, final colors chosen

### 0.6.9

- Color design update (still working on it)

### 0.6.8

- Various bugtesting and patch for input width not conforming to mobile viewport width
- Added circle animation to always be active on mobile

### 0.6.7

- Fixed "messages" appearing under input
- Fixed emoji div blinking when emoji pressed

### 0.6.6

- Further optimization of the emoji layout
- Added hover effects

### 0.6.5

- Animated emoji picker (height transition)

### 0.6.4

- mixin optimization

### 0.6.3

- fixed small bug where login/logout messages appeared above chat due to overflow: scroll fix (added prepend instead of append)
- temporarily set different sizes to icons (not final size)
- online section fixes:
  - layout fixes
  - added a hamburger menu when in mobile view
  - fixed heights and paddings (section height: 100%, topbar 5%, members 95%)

### 0.6.2

- added additional icons (online counter area, emoji icon > added font-awesome icon)

### 0.6.1

- js code cleanup
- start of the css design layout
- replaced inputs and buttons with icons

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

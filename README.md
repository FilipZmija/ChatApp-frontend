# Chat app

This repository is part of chatting app project containing frontend and backend implementation. Here you can find fully implemeneted frontent application that is ready to be run with corresponding backend with it. 
You can try the app here:
You have a choice of trying test user or creating your own account and logging in. Once logged in user sees main screen, on the left side there is list of exisitng conversations that can be choosen, on the right there is a list of active and unactive users that can be searched via textfield that is placed on top of it. Once conversation or user is choosen a conversation view is displayed with previous messages, info about conversation and possibility of sending a message.

## 1. Features
- User authentication: Users can create an account and log in safely.
- Real-time messaging: App allows real-time messaging/
- Message history: Previous messages are stored and displayed in each conversation.
- User is able to search for exisitng users and start new conversations with them as well as create chatting rooms with multiple users.

## 2. Tech stack
- HTML + CSS
- React
- TypeScript
- React Redux
- socket.io
- Material UI
- Axios
Frontend application was created with React and TypeScript. Some of the components were created with usage of MUI library, however multiple of them were designed by myself with css files. 
Since the project required using state of other components all around the application I choosed React Redux as a state management library that allowed to share the state all over the application as well as create very well designed socket factory to be able to easliy communicate with backend of this project. Since backend was designed to fully operate on sockets and API axios library came helpfull with API communication.

## 3. How does it work
### Sockets
Messaging on the frontend side was implemented with usage of socket.io library that was mostly placed in SocketFactory that esatbilishes communication with backend with sockets and is able to communicate in real-time. By placing socketmiddleware in react redux and implementing event listeners I was able to create multiple functions that could further modify store data with recived events. Events such as messaging, user acitvity change or creating new rooms are socket based and client is listening to them all the time.
### API
Some of data is recived by API calls, such as older messages, conversations or users. This happens on component mount and also when user scrolls through the components. With each scroll new data is recived.
### Custom hooks
Since a lot of data in the app is based on calls to API that are limited (calls to one endpoint with limit and offset) and requests are sent whenever scroll reaches bottom line it was need to listen to scroll event inside multiple components. For this purpose I created my own hook that listens to scroll event and whenever scroll reaches bottom or top (that can be chooosen) calls passed function which in this case is API request call. 
### Redux
Whole application was split in couple redux slices mainly  for authorization, converstaion, instance (which hold objects such as conversations, active or unactive users) and socket which is responsible for creating socket. Data in store is modified either by components or previously mentioned middleware that listens for socket events.

## 4. How to run
1. Clone repo
      ```
         git clone https://github.com/FilipZmija/ChatApp-frontend.git 
      ```
      
2. Install dependencies
   ```
   cd ChatApp-frontend
   npm install
   ```
3. Start development server
   ```
   npm start
   ```
4. Open http://localhost:3000 to view the app in your browser.
 

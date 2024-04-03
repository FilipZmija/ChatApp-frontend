import React from "react";
import ChatIcon from "@mui/icons-material/Chat";
import "./LandingInfo.css";
const WelcomeScreen = () => {
  return (
    <div className="welcome-container">
      <p>
        Welcome to our interactive messaging platform! Built with a fusion of
        cutting-edge technologies, including React for dynamic user interfaces,
        Node.js for server-side logic, TypeScript for type safety, Sockets for
        real-time communication, APIs for seamless integration with external
        services, SQL database for efficient data storage, and Sequelize for
        database management.
      </p>
      <p>
        Immerse yourself in the seamless blend of modern web development
        techniques as you embark on your messaging journey. Whether you're here
        to connect with friends, collaborate with colleagues, or engage with
        communities, our platform offers a robust and intuitive experience.
      </p>
      <p>
        On the left side you can see the list of conversation a user has
        created. Once clicked the app displays messags and possibility of
        sending new messages. On the right side there is a list containing
        active users as well as the ones that are not active. In order to search
        for a specific user, you can use the search bar located at the top of
        the list. Start chatting now and experience the synergy of technology
        and communication come to life!
      </p>
    </div>
  );
};

export default WelcomeScreen;

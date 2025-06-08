# 🎥 StreamMingle

A dynamic virtual meeting and streaming platform built for seamless communication and collaboration. This project was developed as part of a hackathon initiative to replicate core features of Twitch, integrated with real-time video conferencing and chat functionalities.

---

## 🚀 Features

- 📺 Real-time Video Meetings  
- 💬 Integrated Live Chat  
- 👥 Create & Join Meeting Rooms  
- 🔒 User Authentication  
- 🖥️ Clean, Modern Frontend UI  
- ⚙️ Node.js Backend with Express  
- 📦 Firebase Integration for Authentication

---

## 📂 Project Structure

`twitch_frontend/`  
├── public/  
├── src/  
│ ├── components/  
│ ├── pages/  
│ ├── login/  
│ ├── join/  
│ ├── homepage/  
│ ├── meetingroom/  
│ └── App.js  
└── package.json

`twitch_backend/`  
├── config/  
│ └── firebase.js  
├── model/  
│ └── roommodel.js  
├── routes/  
│ └── route.js  
├── index.js  
└── package.json

---

## 🛠️ Tech Stack

- React.js  
- Node.js  
- Express.js  
- Firebase Authentication  
- MongoDB  
- 100ms SDK  
- Twitch API  

---

## 🎯 Inspiration

Our inspiration for StreamMingle came from noticing the limitations of existing platforms like Twitch’s Squad Stream and third-party apps like Discord. While these platforms allow some level of group interaction, they either limit the number of participants (Twitch Squad Stream caps at 4) or don’t offer a dedicated, seamless experience for interactive gaming rooms.

We realized there was no popular, dedicated platform on Twitch that enables large, interactive rooms for gamers. This gap inspired us to create StreamMingle, a space that encourages active participation and fosters a sense of community by allowing more users to join and interact in a streaming environment.

---

## 📌 What It Does

StreamMingle provides a platform where viewers can:  
- Join streams  
- Interact in real-time  
- Participate in various collaborative activities  

Users can create rooms and share a unique meeting code with others, who can then log in with their Twitch accounts and use the room code to join that specific room.

It also includes a messaging feature, allowing participants to communicate via pop-up messages, enhancing interaction and engagement within the stream.

By blending interactivity with traditional streaming, StreamMingle elevates the user experience, fostering closer connections between streamers and their audience.

---

## 🛠️ How We Built It

We built StreamMingle using:  
- A React frontend  
- A Node.js/Express backend  

For real-time video and audio streaming, we integrated 100ms, providing the foundation for creating interactive rooms where users can join and participate seamlessly.

Additionally:  
- Twitch APIs handled user login and streaming functionality, allowing users to authenticate via Twitch and directly connect their accounts to StreamMingle.  
- Our backend architecture is modular, enabling efficient data exchange with secure CORS configuration to support real-time interactions smoothly.

---

## ⚙️ Challenges We Ran Into

- Ensuring smooth communication between client and server, especially for real-time interactions.  
- Integrating 100ms for video and audio streaming — our initial attempts to stream both video and audio to Twitch faced difficulties.  
- Managing room states and handling asynchronous functions for real-time updates was a technical hurdle.  

After multiple tests and adjustments, we successfully resolved these issues and ensured a seamless, interactive experience.

---

## 🏆 Accomplishments That We're Proud Of

- Creating a cohesive, engaging platform that fulfilled our original vision.  
- Implementing a user-friendly interface and handling real-time interactions smoothly.  
- Overcoming tough technical challenges with video/audio streaming and room management.  
- Successfully deploying the project for a hackathon demo — a milestone we're thrilled about.

---

## 📚 What We Learned

Through this project, we gained experience in:  
- Full-stack development  
- Integrating frontend and backend systems  
- Real-time data handling  
- Managing asynchronous functions  
- Debugging streaming issues and improving streaming stability  

These lessons significantly enhanced our technical and project management skills.

---

## 🚀 What's Next for StreamMingle

Future plans include:  

- 📈 Scalability Enhancements:  
  Upgrading our infrastructure to support more than 25 concurrent users per stream.  

- 🎨 Enhanced Customization:  
  Allowing streamers to personalize their rooms and interactions further.  

- 📱 Mobile App Development:  
  Launching a mobile version to make StreamMingle accessible on various devices.  

- 🛡️ Improved Moderation Tools:  
  Incorporating moderation features to maintain a positive and safe community environment.  

We also aim to optimize the platform for future scalability, ensuring it can handle larger audiences while maintaining performance and reliability.

---

## 🌐 Live Demo

👉 [StreamMingle Deployed Link](https://twitch-frontend-cp7u.vercel.app/)

---

## 🛠️ Built With

- React.js  
- Node.js  
- Express.js  
- Firebase Authentication  
- MongoDB  
- 100ms SDK  
- Twitch API  

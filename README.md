## 🧠 QuizMaster

QuizMaster is a real-time multiplayer quiz game where players join a shared room and compete to answer questions as quickly as possible. The gameplay follows this flow:

1. **Room Creation & Joining**: A player creates a room and shares the code with others to join.
2. **Question Generation**: The room admin generates the quiz questions.
3. **Question Syncing**: All players in the room receive the same question at the same time.
4. **Real-time Interaction**: Players’ answers are processed instantly using WebSockets to update scores and game progression.
5. **Game End**: After a set number of questions, scores are calculated and displayed.
6. **Game Restart**: The admin can restart the game if desired.

### Quiz Data Handling (`workers/get-quizzes`)

A dedicated worker script uses AI to generate quiz questions dynamically, ensuring fresh and varied content for each game.

## ✨ Features

- 🔁 **Real-time multiplayer quiz gameplay** using WebSockets.
- 🧑‍🤝‍🧑 **Room-based architecture** for group sessions.
- 🤖 **AI-generated quizzes** for fresh and diverse content.
- 🕹️ **Fast-paced competitive gameplay** with scoring based on speed and accuracy.
- 📱 **Responsive UI** optimized for both desktop and mobile devices.

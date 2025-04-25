import { useState, useEffect, useRef, memo, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { showSuccessToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { H1, H4, Muted, P, Small } from "@/components/ui/typography";
import { Clock3, Users, Plus, LucideClipboardList } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Confetti from "react-confetti";

export default function QuizGame() {
  const [gameState, setGameState] = useState("waiting");
  const [users, setUsers] = useState([
    { id: 1, username: "JohnDoe", isAdmin: true, score: 0 },
    { id: 2, username: "Alice", isAdmin: false, score: 0 },
    { id: 3, username: "Bob", isAdmin: false, score: 0 },
    { id: 4, username: "JohnDoe", isAdmin: false, score: 0 },
    { id: 5, username: "Alice", isAdmin: false, score: 0 },
    { id: 6, username: "Bob", isAdmin: false, score: 0 },
    { id: 7, username: "JohnDoe", isAdmin: false, score: 0 },
    { id: 8, username: "Alice", isAdmin: false, score: 0 },
    { id: 9, username: "Bob", isAdmin: false, score: 0 },
  ]);
  const [currentUser, setCurrentUser] = useState({
    id: 1,
    username: "JohnDoe",
    isAdmin: true,
  });
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const quizTopicRef = useRef(null);

  const mockQuestions = [
    {
      id: 1,
      question: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
      correctAnswer: "Mars",
    },
    {
      id: 2,
      question: "What is the chemical symbol for gold?",
      options: ["Go", "Gd", "Au", "Ag"],
      correctAnswer: "Au",
    },
    {
      id: 3,
      question: "Which country is known as the Land of the Rising Sun?",
      options: ["China", "Korea", "Thailand", "Japan"],
      correctAnswer: "Japan",
    },
  ];

  const fetchQuestions = useCallback(() => {
    console.log("Fetching questions for topic:", quizTopicRef?.current?.value);
    setQuestions(mockQuestions);
  }, []);

  const startGame = useCallback(() => {
    if (quizTopicRef?.current?.value?.trim()?.length === 0) {
      return;
    }
    setGameState("quiz");
    setTimeLeft(15);
  }, []);

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    // setTimeout(() => {
    //   goToNextQuestion();
    // }, 1000);
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(15);
    } else {
      setGameState("result");
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === "quiz" && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      goToNextQuestion();
    }

    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const resetGame = () => {
    setGameState("waiting");
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setTimeLeft(15);
    setUsers(users.map((user) => ({ ...user, score: 0 })));
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      {/* Main content */}
      {gameState === "waiting" && (
        <WaitingRoom
          users={users}
          currentUser={currentUser}
          quizTopicRef={quizTopicRef}
          fetchQuestions={fetchQuestions}
          startGame={startGame}
        />
      )}

      {gameState === "quiz" && questions.length > 0 && (
        <QuizStage
          question={questions[currentQuestionIndex]}
          timeLeft={timeLeft}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
          questionNumber={currentQuestionIndex + 1}
          totalQuestions={questions.length}
        />
      )}

      {gameState === "result" && (
        <ResultStage users={users} resetGame={resetGame} />
      )}
    </div>
  );
}

const WaitingRoom = memo(
  ({ users, currentUser, quizTopicRef, fetchQuestions, startGame }) => {
    const copyRoomLink = () => {
      navigator.clipboard.writeText(window.location.href);
      showSuccessToast("Room link copied to clipboard successfully!");
    };

    return (
      <div className="flex-1 flex flex-col gap-4 justify-center items-center max-w-4xl mx-auto w-full px-4 py-8">
        <H1 className="text-center">Waiting Room</H1>

        <div className="flex gap-2 items-center pill px-4 py-1.5 rounded-md">
          <Muted>Copy Room Link </Muted>
          <LucideClipboardList
            size={16}
            className="cursor-pointer text-muted-foreground"
            onClick={copyRoomLink}
          />
        </div>

        {currentUser.isAdmin ? (
          <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-lg w-full">
            <div className="p-5 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Plus className="h-5 w-5 text-indigo-400" />
                <H4>Manage Room</H4>
              </div>
            </div>

            <div className="p-5">
              <Input
                ref={quizTopicRef}
                className="bg-slate-700 text-slate-300 border-none py-6"
                placeholder="Enter quiz topic (e.g., Science, Movies, History)"
              />
            </div>

            <div className="p-5 pt-0 flex gap-2 flex-wrap">
              <Button
                onClick={fetchQuestions}
                variant={"secondary"}
                className="flex-1"
              >
                Generate Questions
              </Button>
              <Button onClick={startGame} className="flex-1">
                Start Quiz
              </Button>
            </div>
          </div>
        ) : (
          <div className="pill p-5 w-full text-center rounded-xl">
            <H4 className="mb-1">Waiting for quiz to start</H4>
            <P className="mx-auto">
              The room admin will select a topic and start the quiz soon.
            </P>
          </div>
        )}

        <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-lg w-full">
          <div className="p-5 border-b border-slate-700">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              <H4>Participants ({users.length})</H4>
            </div>
          </div>

          <div className="p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`flex items-center p-3 rounded-md transition-all ${
                    user.id === currentUser.id
                      ? "bg-indigo-900/40 border border-indigo-500/70 shadow-lg shadow-indigo-900/20"
                      : "bg-slate-700 hover:bg-slate-700/80 border-slate-500 hover:border-slate-500/80"
                  }`}
                >
                  <P className="w-6 h-6 lg:w-8 lg:h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-md text-white font-bold">
                    {user.username.charAt(0).toUpperCase()}
                  </P>
                  <P
                    className={`font-medium ${
                      user.id === currentUser.id
                        ? "text-indigo-200"
                        : "text-white"
                    }`}
                  >
                    {user.username}
                  </P>
                  {user.isAdmin && (
                    <svg
                      className="w-4 h-4 ml-2 text-yellow-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                    </svg>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }
);

// Quiz Stage Component
function QuizStage({
  question,
  timeLeft,
  selectedOption,
  handleOptionSelect,
  questionNumber,
  totalQuestions,
}) {
  // Calculate progress percentage
  const progressPercentage = (questionNumber / totalQuestions) * 100;

  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-lg w-full">
      <div className="p-5 gap-2 border-b border-slate-700 flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <Small className="text-muted-foreground">
            Question {questionNumber}/{totalQuestions}
          </Small>
          <H4>{question.question}</H4>
        </div>
        <div
          className={`flex items-center gap-2 font-bold ${
            timeLeft <= 5 ? "text-red-400" : "text-yellow-400"
          }`}
        >
          <Clock3 size={16} />
          <P
            className={`${timeLeft <= 5 ? "text-red-400" : "text-yellow-400"}`}
          >
            {timeLeft}s
          </P>
        </div>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              className={`flex gap-1 items-center p-3 rounded-lg text-left transition border ${
                selectedOption === option
                  ? selectedOption === question.correctAnswer
                    ? "bg-green-600/30 border-green-500"
                    : "bg-red-600/30 border-red-500"
                  : question.correctAnswer === option && selectedOption
                  ? "bg-green-600/30 border-green-500"
                  : "bg-slate-700 hover:bg-slate-700/80 border-slate-500 hover:border-slate-500/80"
              }`}
              onClick={() => handleOptionSelect(option)}
              disabled={selectedOption !== null}
            >
              <P className="w-6 h-6 lg:w-8 lg:h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-md text-white font-bold">
                {["A", "B", "C", "D"][index]}
              </P>
              <P className={`text-white`}>{option}</P>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Result Stage Component
function ResultStage({ users, resetGame }) {
  // Sort users by score (highest first)
  const sortedUsers = [...users].sort((a, b) => b.score - a.score);

  return (
    <div className="overflow-hidden flex-1 flex flex-col gap-8 justify-center items-center max-w-4xl mx-auto w-full px-4 py-8">
      <Confetti
        numberOfPieces={200}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
        className="mx-auto"
        recycle={false}
      />
      <H1 className="text-center">Leaderboard</H1>
      {/* Leaderboard */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <H4>Rank</H4>
            </TableHead>
            <TableHead>
              <H4>
                <span className="inline-block w-6 mr-2 text-center"></span>
                Username
              </H4>
            </TableHead>
            <TableHead className="text-right">
              <H4>Points</H4>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedUsers.map((user, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">
                <P className="text-lg">{index + 1}</P>
              </TableCell>
              <TableCell>
                <P className="text-lg flex items-center">
                  <span className="inline-block w-6 mr-2 text-center">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                  </span>
                  {user.username}
                </P>
              </TableCell>
              <TableCell className="text-right">
                <P className="text-lg">{user.score}</P>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Actions */}
      <div className="flex justify-center">
        <Button onClick={resetGame} size={"lg"}>
          Back to Waiting Room
        </Button>
      </div>
    </div>
  );
}

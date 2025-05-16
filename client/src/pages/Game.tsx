import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Confetti from "react-confetti";
import { Input } from "@/components/ui/input";
import { showErrorToast, showSuccessToast } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { H1, H4, Muted, P, Small } from "@/components/ui/typography";
import React, { useState, useEffect, useRef } from "react";
import { Clock3, Users, Plus, LucideClipboardList } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { UseAuth } from "@/provider/AuthProvider";
import Loader from "@/components/Loader";

interface User {
  username: string;
  is_admin: boolean;
  score?: number;
}

interface Question {
  question_number: number;
  text: string;
  options: object;
}

type Difficulty = "Easy" | "Medium" | "Hard";

type GameState = "waiting" | "quiz" | "result";

export default function QuizGame() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const quizTopicRef = useRef<HTMLInputElement>(null);
  const [users, setUsers] = useState<User[] | []>([]);
  const [timeLeft, setTimeLeft] = useState<number>(20);
  const [answer, setAnswer] = useState<string | null>(null);
  const [socket, setSocket] = useState<null | WebSocket>(null);
  const [question, setQuestion] = useState<Question | null>(null);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [difficulty, setDifficulty] = useState<Difficulty>("Easy");
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [gameState, setGameState] = useState<GameState>("waiting");
  const [questionsAvailable, setQuestionsAvailable] = useState<boolean>(false);
  const questionRef = useRef<typeof question>(question);
  const [generatingQuestions, setGeneratingQuestions] =
    useState<boolean>(false);
  const { userData } = UseAuth();
  const navigate = useNavigate();

  useEffect(() => {
    questionRef.current = question;
  }, [question]);

  const fetchQuestions = () => {
    if (
      quizTopicRef?.current &&
      quizTopicRef.current?.value?.trim()?.length >= 4
    ) {
      setGeneratingQuestions(true);
      if (socket?.readyState === WebSocket.OPEN) {
        socket?.send(
          JSON.stringify({
            type: "generate-questions",
            topic: quizTopicRef.current?.value?.trim(),
            difficulty: difficulty,
          })
        );
      } else showErrorToast("Connection closed already");
    } else showErrorToast("Atleas 4 characters are required!");
  };

  const startGame = () => {
    if (!questionsAvailable) {
      showErrorToast("Generate questions before starting the quiz!");
      return;
    }
    socket?.send(
      JSON.stringify({
        type: "start-quiz",
      })
    );
  };

  const handleOptionSelect = (key: string) => {
    setSelectedOption(key);
    socket?.send(
      JSON.stringify({
        type: "add-response",
        option: key,
        question_number: question?.question_number,
      })
    );
  };

  const resetGame = () => {
    socket?.send(
      JSON.stringify({
        type: "reset-quiz",
      })
    );
  };

  useEffect(() => {
    if (userData && users?.length) {
      const me = users.find(
        (user: User) => user.username === userData.username
      );
      setCurrentUser(me || null);
    }
  }, [users, userData]);

  useEffect(() => {
    if (!userData?.username || socket) return;
    const ws = new WebSocket(import.meta.env.VITE_WS_URL);
    setSocket(ws);
    ws.onopen = () => {
      ws.send(
        JSON.stringify({
          type: "join-room",
          room_id: id,
        })
      );
    };
    ws.onmessage = (data: any) => {
      data = JSON.parse(data.data);
      if (data.type === "joined") {
        if (!data.success) {
          showErrorToast(data.message);
          navigate("/home");
        } else {
          setUsers(data.users);
          showSuccessToast(data.message);
        }
      } else if (data.type === "left") {
        setUsers(data.users);
        showErrorToast(data.message);
      } else if (data.type === "questions") {
        setGeneratingQuestions(false);
        if (!data.success) showErrorToast(data.message);
        else if (!data.questionsAvailable)
          showErrorToast("Could not generate the questions");
        else {
          setQuestionsAvailable(data.questionsAvailable);
          showSuccessToast(data.message);
        }
      } else if (data.type === "start-quiz") {
        if (!data.success) showErrorToast(data.message);
      } else if (data.type === "question") {
        const {
          time_left,
          question_number,
          question_text,
          question_options,
        }: {
          time_left: number;
          question_number: number;
          question_text: string;
          question_options: object;
        } = data;
        if (question_number === 1) setGameState("quiz");
        setTimeLeft(time_left);
        setQuestion({
          question_number: question_number,
          text: question_text,
          options: question_options,
        });
        setAnswer(null);
        setSelectedOption(null);
      } else if (data.type === "timer") {
        setTimeLeft(data.time_left);
      } else if (data.type === "response") {
        setTimeout(() => {
          if (!data.success) showErrorToast(data.message);
          else {
            if (
              data.question_number === questionRef?.current?.question_number
            ) {
              setAnswer(data.correct_answer);
            }
          }
        }, 100);
      } else if (data.type === "leaderboards") {
        setUsers(data.users);
        setGameState("result");
        showSuccessToast(data.message);
      } else if (data.type === "reset-quiz") {
        if (!data.success) showErrorToast(data.message);
        else {
          setQuestionsAvailable(false);
          setSelectedOption(null);
          setGameState("waiting");
          setQuestion(null);
          setAnswer(null);
          setTimeLeft(20);
          setUsers(data.users);
        }
      } else if (data.type === "current-quiz-details") {
        setGameState(data.state);
        if (data.state === "quiz") {
          setQuestion(data.question);
          setTimeLeft(data.time_left);
          setAnswer(data.has_responded ? data.correct_answer : null);
          setSelectedOption(data.has_responded ? data.user_answer : null);
        } else if (data.state === "result") setUsers(data.users);
        setLoading(false);
      }
    };
    ws.onerror = (e) => {
      console.error("WebSocket error", e);
    };
    return () => {
      ws.close();
      setSocket(null);
    };
  }, [userData.username]);

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      {/* Main content */}
      {gameState === "waiting" && (
        <WaitingRoom
          users={users}
          roomCode={id}
          currentUser={currentUser}
          quizTopicRef={quizTopicRef}
          difficulty={difficulty}
          setDifficulty={setDifficulty}
          fetchQuestions={fetchQuestions}
          startGame={startGame}
          questionsAvailable={questionsAvailable}
          generatingQuestions={generatingQuestions}
          loading={loading}
        />
      )}

      {gameState === "quiz" && (
        <QuizStage
          question={question}
          answer={answer}
          timeLeft={timeLeft}
          selectedOption={selectedOption}
          handleOptionSelect={handleOptionSelect}
          questionNumber={question?.question_number}
          loading={loading}
        />
      )}

      {gameState === "result" && (
        <ResultStage
          currentUser={currentUser}
          users={users}
          resetGame={resetGame}
          loading={loading}
        />
      )}
    </div>
  );
}

const WaitingRoom = ({
  users,
  roomCode,
  currentUser,
  quizTopicRef,
  fetchQuestions,
  startGame,
  difficulty,
  setDifficulty,
  questionsAvailable,
  generatingQuestions,
  loading,
}: {
  users: User[];
  roomCode: string | undefined;
  currentUser: User | null;
  quizTopicRef: React.RefObject<HTMLInputElement>;
  fetchQuestions: () => void;
  startGame: () => void;
  difficulty: Difficulty;
  setDifficulty: React.Dispatch<React.SetStateAction<Difficulty>>;
  questionsAvailable: boolean;
  generatingQuestions: boolean;
  loading: boolean;
}) => {
  const copyRoomCode = () => {
    if (!roomCode) return;
    navigator.clipboard.writeText(roomCode);
    showSuccessToast("Room code copied to clipboard successfully!");
  };

  if (loading) return <Loader />;

  return (
    <div className="flex-1 flex flex-col gap-4 justify-center items-center max-w-4xl mx-auto w-full px-4 py-8">
      <H1 className="text-center">Waiting Room</H1>

      <div className="flex gap-2 items-center pill px-4 py-1.5 rounded-md">
        <Muted>Copy Room Code </Muted>
        <LucideClipboardList
          size={16}
          className="cursor-pointer text-muted-foreground"
          onClick={copyRoomCode}
        />
      </div>

      {currentUser?.is_admin ? (
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
              disabled={questionsAvailable || generatingQuestions}
              className="bg-slate-700 text-slate-300 border-none py-6"
              placeholder="Enter quiz topic (e.g., Science, Movies, History)"
            />
          </div>

          <div className="p-5 pt-0">
            <Select
              value={difficulty}
              disabled={questionsAvailable || generatingQuestions}
              onValueChange={(value: Difficulty) => setDifficulty(value)}
            >
              <SelectTrigger className="bg-slate-700 text-slate-300">
                <SelectValue placeholder="Select difficulty of the quiz" />
              </SelectTrigger>
              <SelectContent className="bg-slate-700 text-slate-300">
                <SelectGroup>
                  <SelectLabel>Difficulty Level</SelectLabel>
                  {["Easy", "Medium", "Hard"].map((level) => (
                    <SelectItem
                      className="hover:!bg-slate-800/80 focus:!bg-slate-800/80"
                      value={level}
                      key={level}
                    >
                      {level}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="p-5 pt-0 flex gap-2 flex-wrap">
            <Button
              onClick={fetchQuestions}
              variant="secondary"
              className="flex-1"
              disabled={questionsAvailable || generatingQuestions}
            >
              {questionsAvailable
                ? "Questions Generated"
                : generatingQuestions
                ? "Generating Questions"
                : "Generate Questions"}
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
            {users.map((user: User) => (
              <div
                key={user.username}
                className={`flex items-center p-3 rounded-md transition-all ${
                  user.username === currentUser?.username
                    ? "bg-indigo-900/40 border border-indigo-500/70 shadow-lg shadow-indigo-900/20"
                    : "bg-slate-700 hover:bg-slate-700/80 border-slate-500 hover:border-slate-500/80"
                }`}
              >
                <P className="w-6 h-6 lg:w-8 lg:h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-md text-white font-bold">
                  {user.username.charAt(0).toUpperCase()}
                </P>
                <P
                  className={`font-medium ${
                    user.username === currentUser?.username
                      ? "text-indigo-200"
                      : "text-white"
                  }`}
                >
                  {user.username}
                </P>
                {user?.is_admin && (
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
};

function QuizStage({
  question,
  answer,
  timeLeft,
  selectedOption,
  handleOptionSelect,
  questionNumber,
  loading,
}: {
  question: Question | null;
  answer: string | null;
  timeLeft: number;
  selectedOption: string | null;
  handleOptionSelect: (key: string) => void;
  questionNumber: number | undefined;
  loading: boolean;
}) {
  if (loading) return <Loader />;
  return (
    <div className="bg-slate-800/80 rounded-xl border border-slate-700 shadow-lg w-full">
      <div className="p-5 border-b border-slate-700 w-full">
        <div className="flex justify-between items-center mb-2">
          <Small className="text-muted-foreground">
            Question {questionNumber}/10
          </Small>
          <div
            className={`flex items-center gap-2 font-bold ${
              timeLeft <= 5 ? "text-red-400" : "text-yellow-400"
            }`}
          >
            <Clock3 size={14} />
            <Small
              className={`${
                timeLeft <= 5 ? "text-red-400" : "text-yellow-400"
              }`}
            >
              {timeLeft}s
            </Small>
          </div>
        </div>
        <H4 className="text-lg">{question?.text}</H4>
      </div>

      <div className="p-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {question?.options &&
            Object.entries(question.options).map(([key, value], index) => (
              <button
                key={index}
                className={`flex gap-1 items-center p-3 rounded-lg text-left transition border ${
                  answer != null
                    ? selectedOption === key
                      ? selectedOption === answer
                        ? "bg-green-600/30 border-green-500"
                        : "bg-red-600/30 border-red-500"
                      : key === answer && selectedOption
                      ? "bg-green-600/30 border-green-500"
                      : "bg-slate-700 hover:bg-slate-700/80 border-slate-500 hover:border-slate-500/80"
                    : selectedOption === key
                    ? "bg-indigo-900/40 border-indigo-500/70"
                    : "bg-slate-700 hover:bg-slate-700/80 border-slate-500 hover:border-slate-500/80"
                }`}
                onClick={() => handleOptionSelect(key)}
                disabled={selectedOption !== null}
              >
                <P className="shrink-0 w-6 h-6 lg:w-8 lg:h-8 bg-indigo-500 rounded-full flex items-center justify-center mr-3 shadow-md text-white font-bold">
                  {["A", "B", "C", "D"][index]}
                </P>
                <P>{value}</P>
              </button>
            ))}
        </div>
      </div>
    </div>
  );
}

function ResultStage({
  currentUser,
  users,
  resetGame,
  loading,
}: {
  currentUser: User | null;
  users: User[];
  resetGame: () => void;
  loading: boolean;
}) {
  if (loading) <Loader />;
  return (
    <div className="overflow-hidden flex-1 flex flex-col gap-8 justify-center items-center max-w-4xl mx-auto w-full px-4 py-8">
      {users[0].username === currentUser?.username && (
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
      )}
      <H1 className="text-center">Leaderboard</H1>
      {/* Leaderboard */}
      <Table className="my-8">
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
          {users.map((user, index) => (
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
      {currentUser?.is_admin ? (
        <div className="flex justify-center">
          <Button onClick={resetGame} size={"lg"}>
            Back to Waiting Room
          </Button>
        </div>
      ) : (
        <P>
          Wait for the admin to restart the game or{" "}
          <Link to={"/home"}>go back</Link>
        </P>
      )}
    </div>
  );
}

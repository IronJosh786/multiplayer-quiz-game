import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useState } from "react";
import { Plus, Users } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { H1, P, Small, Quote } from "@/components/ui/typography";

const Home = () => {
  const [roomCode, setRoomCode] = useState("");

  const handleJoinRoom = () => {};

  const handleCreateRoom = () => {};

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <H1 className="text-center">Ready to Quiz?</H1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 mt-6">
        {/* Create Room Card */}
        <Card className="bg-slate-800 shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5 text-indigo-400" />
              Create a Room
            </CardTitle>
            <CardDescription>
              Set up a new quiz session for others to join
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="bg-slate-700 rounded-lg p-4">
              <P>As a room creator you can:</P>
              <ul className="space-y-2 mt-2">
                <li className="flex items-center gap-2">
                  <div className="bg-indigo-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <Small>Share your room code to invite others.</Small>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-indigo-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <Small>Choose quiz topic</Small>
                </li>
                <li className="flex items-center gap-2">
                  <div className="bg-indigo-600 rounded-full h-5 w-5 flex items-center justify-center flex-shrink-0">
                    ✓
                  </div>
                  <Small>Start quiz</Small>
                </li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Button onClick={handleCreateRoom} className="w-full">
              Create New Room
            </Button>
          </CardFooter>
        </Card>

        {/* Join Room Card */}
        <Card className="bg-slate-800 shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-400" />
              Join a Room
            </CardTitle>
            <CardDescription>
              Enter a room code to join an existing quiz
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 flex-1">
            <div className="space-y-2">
              <Small>Room Code</Small>
              <Input
                id="roomCode"
                value={roomCode}
                onChange={(e) => {
                  setRoomCode(e.target.value.toUpperCase());
                }}
                placeholder="Enter 6-digit code (e.g. XYZ123)"
                className="bg-slate-700 text-slate-300"
                maxLength={6}
              />
            </div>
            <Quote className="bg-slate-700 rounded-lg p-4 border-l-indigo-400">
              <Small>
                Ask your quiz host for the unique 6-character room code to join
                their quiz session.
              </Small>
            </Quote>
          </CardContent>
          <CardFooter>
            <Button onClick={handleJoinRoom} className="w-full">
              Join Room
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Home;

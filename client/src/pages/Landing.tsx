import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { UseAuth } from "@/provider/AuthProvider";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, BrainCircuit, Crown } from "lucide-react";
import { H2, H3, H4, P } from "@/components/ui/typography";

const Landing = () => {
  const { isLoggedIn, loading } = UseAuth();
  const navigate = useNavigate();

  const handleLogin = () => {
    if (loading) return;
    if (isLoggedIn) navigate("/home");
    else navigate("/signin");
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      {/* Hero Section */}
      <div className="flex flex-col items-center gap-6">
        <H2 className="text-center">Compete in real-time quiz competitions</H2>
        <P className="text-center">
          Challenge friends, colleagues, or students with interactive quizzes by
          creating custom rooms or joining existing ones with a simple code.
        </P>
        <div>
          {loading && <Skeleton className="h-12 w-[163.28px] self-start" />}
          {!loading && (
            <Button
              onClick={handleLogin}
              size="lg"
              className="text-lg px-8 py-6 bg-accent-foreground self-start"
            >
              Get Started
            </Button>
          )}
        </div>
      </div>

      {/* Features Section */}
      <div className="mx-auto mt-12">
        <H3 className="text-center">Why Choose QuizMaster?</H3>
        <div className="grid md:grid-cols-3 gap-2 mt-4">
          <div className="flex flex-col gap-1 bg-slate-800/80 border border-slate-700 rounded-lg p-6 text-center">
            <div className="flex justify-center">
              <Users className="h-10 w-10 text-indigo-400" />
            </div>
            <H4 className="text-center">Multiplayer Fun</H4>
            <P>
              Create private rooms for friends or open competitions with
              unlimited participants.
            </P>
          </div>
          <div className="flex flex-col gap-1 bg-slate-800/80 border border-slate-700 rounded-lg p-6 text-center">
            <div className="flex justify-center">
              <BrainCircuit className="h-10 w-10 text-indigo-400" />
            </div>
            <H4 className="text-center">AI Quiz Generator</H4>
            <P>
              From history to memes, just name it—AI builds your quiz so you can
              jump right in.
            </P>
          </div>
          <div className="flex flex-col gap-1 bg-slate-800/80 border border-slate-700 rounded-lg p-6 text-center">
            <div className="flex justify-center">
              <Crown className="h-10 w-10 text-indigo-400" />
            </div>
            <H4 className="text-center">Leaderboard Reveal</H4>
            <P>
              See how you stack up at the end—top scorers shine on the final
              leaderboard.
            </P>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

export default function Loader() {
  return (
    <div className="flex flex-row gap-2 justify-center mt-8">
      <div className="w-3 h-3 rounded-full bg-slate-700 animate-bounce"></div>
      <div className="w-3 h-3 rounded-full bg-slate-700 animate-bounce [animation-delay:-.3s]"></div>
      <div className="w-3 h-3 rounded-full bg-slate-700 animate-bounce [animation-delay:-.5s]"></div>
    </div>
  );
}

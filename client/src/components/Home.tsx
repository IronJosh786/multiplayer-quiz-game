import { Outlet } from "react-router-dom";

const Home = () => {
  return (
    <div className="max-w-2xl mx-auto min-h-dvh flex flex-col p-4">
      <h3 className="text-center font-semibold text-3xl">✨ Quotify ✨</h3>
      <Outlet />
    </div>
  );
};

export default Home;

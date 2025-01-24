import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-dvh max-h-dvh flex flex-col justify-center items-center">
      <h4 className="text-5xl font-semibold mb-4">404</h4>
      <p className="mb-8 text-lg">
        Looks like you've ventured into the unknown digital realm.
      </p>
      <Button
        onClick={() =>
          window.history.length > 2 ? navigate(-1) : navigate("/")
        }
      >
        Return
      </Button>
    </div>
  );
};

export default NotFound;

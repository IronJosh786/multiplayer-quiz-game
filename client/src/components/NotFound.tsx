import { Button } from "./ui/button";
import { H1, P } from "./ui/typography";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <H1>404</H1>
      <P className="text-center mt-2">
        Looks like you've ventured into the unknown digital realm.
      </P>
      <div className="mt-4">
        <Button
          onClick={() =>
            window.history.length > 2 ? navigate(-1) : navigate("/home")
          }
        >
          Return
        </Button>
      </div>
    </div>
  );
};

export default NotFound;

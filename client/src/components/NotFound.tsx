import { Button } from "./ui/button";
import { H4, P } from "./ui/typography";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="flex-1 flex flex-col justify-center items-center">
      <H4 className="text-5xl">404</H4>
      <P className="text-center">
        Looks like you've ventured into the unknown digital realm.
      </P>
      <div className="mt-6">
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

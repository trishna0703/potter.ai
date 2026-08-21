import { useSearchParams } from "react-router-dom";
import RaiseConcernStep1 from "./components/RaiseConcernStep1";
import RaiseConcernStep3 from "./components/RaiseConcernStep3";

const RaiseConcern = () => {
  const [searchParams] = useSearchParams();

  const step = searchParams.get("step");

  switch (step) {
    case "1":
      return <RaiseConcernStep1 />;
    case "2":
      return <RaiseConcernStep3 />;
    default:
      return null;
  }
};

export default RaiseConcern;

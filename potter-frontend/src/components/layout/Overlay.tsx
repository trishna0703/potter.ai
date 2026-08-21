import { LoaderIcon } from "lucide-react";

const Overlay = () => {
  return (
    <div className="size-full fixed top-0 left-0 bg-black/40 flex justify-center items-center">
      <LoaderIcon className="loader" />
    </div>
  );
};

export default Overlay;

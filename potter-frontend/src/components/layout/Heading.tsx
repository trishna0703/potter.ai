import { cn } from "#lib/utils";

interface HeadingProps {
  text: string;
  className?: string;
}
const Heading = ({ text, className }: HeadingProps) => {
  return <h1 className={cn("text-2xl font-bold text-center", className)}>{text}</h1>;
};

export default Heading;

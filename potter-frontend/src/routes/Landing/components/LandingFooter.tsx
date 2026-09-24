import { Link } from "react-router-dom";

const LandingFooter = () => {
  return (
    <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
      <div>
        <Link
          to="/"
          className="text-xl font-semibold tracking-tight text-[#304630]"
        >
          <img src="/Potter-logo.png" alt="logo" className="w-48 -ms-2" />
        </Link>

        <p className="mt-3 max-w-sm text-sm leading-6 text-[#788178]">
          A calmer way to keep track of your plants, understand their needs, and
          care for them over time.
        </p>
      </div>

      <div className="flex flex-col gap-3 text-sm text-[#788178] md:items-end">
        <div className="flex gap-5">
          <Link to="/privacy" className="transition hover:text-[#304630]">
            Privacy Policy
          </Link>

          <Link to="/terms" className="transition hover:text-[#304630]">
            Terms of Service
          </Link>
        </div>

        <p>© {new Date().getFullYear()} Potter.ai. All rights reserved.</p>
      </div>
    </div>
  );
};

export default LandingFooter;

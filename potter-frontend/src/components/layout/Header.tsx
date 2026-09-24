import { ArrowRightIcon } from "@phosphor-icons/react";

import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-muted/80 bg-card/90 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <Link to="/">
          <img src="/Potter-logo.png" alt="logo" className="w-36" />
        </Link>

        <nav className="hidden items-center gap-7 md:flex">
          <a
            href="#features"
            className="text-sm text-muted-foreground transition hover:text-muted-foreground/80"
          >
            Features
          </a>

          <a
            href="#who"
            className="text-sm text-muted-foreground transition hover:text-muted-foreground/80"
          >
            Who it's for
          </a>

          <a
            href="#how-it-works"
            className="text-sm text-muted-foreground transition hover:text-muted-foreground/80"
          >
            How it works
          </a>
        </nav>

        <Link to="/login" className="button-custom">
          Get Potter <ArrowRightIcon />
        </Link>
      </div>
    </header>
  );
};

export default Header;

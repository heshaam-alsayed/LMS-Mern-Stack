"use client";

import { Button } from "@/components/ui/button";
import { FaChrome, FaGithub } from "react-icons/fa";
import { signIn } from "next-auth/react";

export default function SocialAuthButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button onClick={() => signIn("google" , {
        redirectTo: "/?login=success"
      })} type="button" variant="outline">
        <FaChrome className="mr-2 h-4 w-4" />
        Google
      </Button>

      <Button onClick={() => signIn("github", {
        redirectTo: "/?login=success"
      })} type="button" variant="outline">
        <FaGithub className="mr-2 h-4 w-4" />
        GitHub
      </Button>
    </div>
  );
}

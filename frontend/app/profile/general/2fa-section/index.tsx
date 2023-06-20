"use client";

import Enable2faButton from "./Enable2faButton";
import { useUser } from "@/app/context/user-context";
import Disable2faButton from "./Disable2faButton";

export default function TfaSection() {
  const { user } = useUser();
  return (
    <div className="flex flex-col space-y-8">
      <div className="flex flex-col space-y-3">
        <h2 className="text-h4 font-semibold">Two-factor authentication</h2>
        <p className="text-base text-gray-600">
          Use an authentication app to get a verification code to log into your
          Transcendence account safely.
        </p>
      </div>
      <div className="flex flex-col">
        <hr className="my-4 mt-0 w-full border-t border-gray-100" />
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className="icon-container icon-md text-gray-500"
              aria-hidden="true"
            >
              {/* prettier-ignore */}
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="feather feather-smartphone"><rect x="5" y="2" width="14" height="20" rx="2" ry="2"></rect><path d="M12 18h.01"></path></svg>
            </div>
            <p className="text-base">Authenticator App</p>
          </div>
          {user?.isTfaEnabled ? <Disable2faButton /> : <Enable2faButton />}
        </div>
      </div>
    </div>
  );
}

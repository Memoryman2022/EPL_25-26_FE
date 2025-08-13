"use client";

import { Suspense } from "react";
import UserProfileContent from "./UserProfileContent";

export default function UserProfilePage() {
  return (
    <Suspense fallback={<p>Loading profile...</p>}>
      <UserProfileContent />
    </Suspense>
  );
}

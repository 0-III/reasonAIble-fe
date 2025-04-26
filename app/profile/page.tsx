import { UserProfile } from "@/components/auth/user-profile";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function ProfilePage() {
  return (
    <div className="container max-w-md py-8 md:py-12">
      <ProtectedRoute>
        <UserProfile />
      </ProtectedRoute>
    </div>
  );
}

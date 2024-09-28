import {useAuth} from "../../hooks/use-auth";

export const getAuthenticatedUser = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const { user } = useAuth();
  const { user_id } = useAuth();
  const { user_name } = useAuth();

  // Append cache-busting timestamp to the avatar URL
  return {
    id: user_id,
    avatar: `${apiBaseUrl}/api/user/${user_id}/profile-image?t=${new Date().getTime()}`,
    name: user_name,
    email: user,
  };
};

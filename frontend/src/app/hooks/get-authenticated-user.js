import {useAuth} from "../../hooks/use-auth";

export const getAuthenticatedUser = () => {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

  const { user } = useAuth();
  const { user_id } = useAuth();
  const { user_name } = useAuth();

  return {
    id: user_id,
    avatar: `${apiBaseUrl}/api/user/${user_id}/profile-image`,
    name: user_name,
    email: user,
  };
};

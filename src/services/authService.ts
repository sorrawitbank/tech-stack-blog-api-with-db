import AppError from "../errors/AppError";
import UserRepository from "../repositories/userRepository";
import supabaseClient from "../supabase/client";

const AuthService = {
  register: async (
    name: string,
    username: string,
    email: string,
    password: string,
  ) => {
    const lookup = {
      user: (await UserRepository.getByUsername(username))[0],
    };

    if (lookup.user) {
      throw new AppError("This username is already taken", 400);
    }

    const { data, error: authError } = await supabaseClient.auth.signUp({
      email,
      password,
    });

    if (authError || data.user === null) {
      if (authError?.code === "user_already_exists") {
        throw new AppError("User with this email already exists", 400);
      }
      throw new AppError("Failed to create user. Please try again", 400);
    }

    await UserRepository.create(data.user.id, username, name);
  },

  login: async (email: string, password: string) => {
    const { data, error: authError } =
      await supabaseClient.auth.signInWithPassword({
        email,
        password,
      });

    if (authError) {
      if (
        authError.code === "invalid_credentials" ||
        authError.message.includes("Invalid login credentials")
      ) {
        throw new AppError(
          "Your password is incorrect or this email doesn't exist",
          400,
        );
      }

      throw new AppError(authError.message, 400);
    }

    return data.session.access_token;
  },

  getUser: async (token: string) => {
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError) {
      throw new AppError("Unauthorized or token expired", 401);
    }

    return { user: (await UserRepository.getById(data.user.id))[0], data };
  },

  resetPassword: async (
    token: string,
    oldPassword: string,
    newPassword: string,
  ) => {
    const { data, error: authError } = await supabaseClient.auth.getUser(token);

    if (authError) {
      throw new AppError("Unauthorized or token expired", 401);
    }

    const { error: loginError } = await supabaseClient.auth.signInWithPassword({
      email: data.user.email!,
      password: oldPassword,
    });

    if (loginError) {
      throw new AppError("Invalid old password", 400);
    }

    const { error: passwordError } = await supabaseClient.auth.updateUser({
      password: newPassword,
    });

    if (passwordError) {
      throw new AppError(passwordError.message, 400);
    }
  },
};

export default AuthService;

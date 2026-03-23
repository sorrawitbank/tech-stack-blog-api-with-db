import AppError from "../errors/AppError";
import UserRepository from "../repositories/user.repository";
import supabaseAdmin from "../supabase/admin";
import supabaseClient from "../supabase/client";

const bucket = "user-assets";

const UserService = {
  updateUser: async (
    userId: string,
    name: string,
    username: string,
    file: Express.Multer.File | undefined,
    bio: string | undefined
  ) => {
    const lookup = {
      user: (await UserRepository.getByUsername(username))[0],
    };

    if (lookup.user) {
      throw new AppError("This username is already taken", 400);
    }

    const user = (await UserRepository.getById(userId))[0];
    let filePath: string | undefined;

    try {
      let publicUrl: string | undefined;

      // Upload pet image
      if (file) {
        const fileExt = file.mimetype.split("/")[1];
        filePath = `${userId}.${fileExt}`;

        const { error } = await supabaseClient.storage
          .from(bucket)
          .upload(filePath, file.buffer, { contentType: file.mimetype });

        if (error) {
          throw error;
        }

        const { data } = supabaseClient.storage
          .from(bucket)
          .getPublicUrl(filePath);

        publicUrl = data.publicUrl;
      }

      const result = await UserRepository.update(
        userId,
        name,
        username,
        publicUrl,
        bio
      );

      if (publicUrl && user.profilePic) {
        await supabaseAdmin.storage
          .from(bucket)
          .remove([user.profilePic.split(`/${bucket}/`)[1]]);
      }

      return result;
    } catch {
      // Rollback
      if (filePath) {
        await supabaseAdmin.storage.from(bucket).remove([filePath]);
      }

      throw new AppError("Failed to create post", 500);
    }
  },
};

export default UserService;

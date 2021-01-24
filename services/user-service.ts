import { User } from '../database';

export interface UserRequest {
  email: string,
  password: string,
  timezone: string,
}

export interface UpdateUserRequest {
  email?: string,
  timezone?: string,
  password?: string,
}

export const createUser = async (userRequest: UserRequest) => {
  try {
    const user = await User.create(userRequest);
    return user;
  } catch (e) {
    console.error('Could not create user! Error: ', e);
    return null;
  }
}

export const updateUser = async (user: User, updateRequest: UpdateUserRequest) => {
  try {
    const updates = {
      email: updateRequest.email || user.email,
      timezone: updateRequest.timezone || user.timezone,
      password: updateRequest.password || user.password,
    }
    return user.update(updates);
  } catch (e) {
    console.error('Could not update user! Error: ', e);
    return null;
  }
}

export const findUserByEmail = async (email: string) => {
  try {
    const user = await User.findOne({ where: { email } });
    return user;
  } catch (e) {
    console.error('Could not find user! Error: ', e);
    return null;
  }
}

export const findUserById = (id: number) => {
  try {
    return  User.findByPk(id);
  } catch (e) {
    console.error('Could not find user! Error: ', e);
    return null;
  }
}
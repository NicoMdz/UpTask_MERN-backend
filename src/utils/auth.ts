import bcrypt from "bcrypt";

export const hashPassword = async (password: string) => {
  //Hash Password
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const checkPassword = async (enteredPassword: string, storedHash : string) => {
  //compare compara el input plano vs la cadena hasheada
  return await bcrypt.compare(enteredPassword, storedHash)
} 
import * as bcrypt from 'bcryptjs';

export async function cryptjsComparePassword(
  plainPassword: string,
  currentPassword: string,
): Promise<boolean> {
  return await bcrypt.compare(plainPassword, currentPassword);
}

import { z } from 'zod';

export const loginSchema = z.object({
  phone: z.string().min(6, '请输入手机号'),
  password: z.string().min(6, '请输入密码')
});

export const registerSchema = z.object({
  phone: z.string().min(6, '请输入手机号'),
  password: z.string().min(6, '请输入密码'),
  smsCode: z.string().min(4, '请输入验证码')
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;

'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { loginSchema, type LoginFormValues } from '@/utils/validation';

export function useLoginForm() {
  const router = useRouter();
  const { loginMutation } = useAuth();
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { phone: '', password: '' }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await loginMutation.mutateAsync(values);
      if (res.success) {
        router.replace('/dashboard');
      }
    } catch (_error) {
      // Error state is exposed via mutation data.
    }
  });

  return {
    form,
    onSubmit,
    isSubmitting: loginMutation.isPending,
    error: loginMutation.data?.success ? null : loginMutation.data?.error
  };
}

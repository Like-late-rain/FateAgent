'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/use-auth';
import { registerSchema, type RegisterFormValues } from '@/utils/validation';

export function useRegisterForm() {
  const router = useRouter();
  const { registerMutation } = useAuth();
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: { phone: '', password: '', smsCode: '' }
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const res = await registerMutation.mutateAsync(values);
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
    isSubmitting: registerMutation.isPending,
    error: registerMutation.data?.success ? null : registerMutation.data?.error
  };
}

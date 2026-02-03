'use client';

import { useMutation } from '@tanstack/react-query';
import type { CreateOrderRequest } from '@fateagent/shared-types';
import { createOrder } from '@/services/orders';

export function useOrders() {
  const createOrderMutation = useMutation({
    mutationFn: (data: CreateOrderRequest) => createOrder(data)
  });

  return { createOrderMutation };
}

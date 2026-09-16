import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import type { GoalInput } from '@irl-quest/api-client';
import { apiClient } from '../auth/api';

export const goalsQueryKey = ['goals'] as const;

export function useGoals() {
  const queryClient = useQueryClient();
  const goals = useQuery({
    queryKey: goalsQueryKey,
    queryFn: async () => (await apiClient.goals()).goals,
    retry: false,
  });
  const invalidate = () => queryClient.invalidateQueries({ queryKey: goalsQueryKey });
  const create = useMutation({ mutationFn: (input: GoalInput) => apiClient.createGoal(input), onSuccess: invalidate });
  const update = useMutation({ mutationFn: ({ id, input }: { id: string; input: Partial<GoalInput> }) => apiClient.updateGoal(id, input), onSuccess: invalidate });
  const remove = useMutation({ mutationFn: (id: string) => apiClient.deleteGoal(id), onSuccess: invalidate });
  return { ...goals, create, update, remove };
}

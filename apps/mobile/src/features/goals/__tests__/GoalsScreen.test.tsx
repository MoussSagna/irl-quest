import React from 'react';
import { fireEvent, render, waitFor } from '@testing-library/react-native';
import GoalsScreen from '../GoalsScreen';

const mockMutateAsync = jest.fn();
const mockRefetch = jest.fn();
let mockState: { data?: unknown[]; isLoading: boolean; isError: boolean; error?: Error | null } = {
  data: [],
  isLoading: false,
  isError: false,
  error: null,
};

jest.mock('../useGoals', () => ({
  useGoals: () => ({ ...mockState, refetch: mockRefetch, create: { isPending: false, mutateAsync: mockMutateAsync } }),
}));

describe('GoalsScreen', () => {
  beforeEach(() => {
    mockMutateAsync.mockReset();
    mockRefetch.mockReset();
    mockState = { data: [], isLoading: false, isError: false, error: null };
  });

  it('renders loading, error and empty states', () => {
    mockState = { isLoading: true, isError: false };
    const loading = render(<GoalsScreen />);
    expect(loading.getByText('Loading goals…')).toBeTruthy();
    loading.unmount();

    mockState = { isLoading: false, isError: true, error: new Error('Network unavailable') };
    const error = render(<GoalsScreen />);
    expect(error.getByText('Network unavailable')).toBeTruthy();
    fireEvent.press(error.getByRole('button', { name: 'Retry goals' }));
    expect(mockRefetch).toHaveBeenCalled();
    error.unmount();

    mockState = { data: [], isLoading: false, isError: false };
    expect(render(<GoalsScreen />).getByText('Your next chapter starts with a goal.')).toBeTruthy();
  });

  it('displays API goals and creates a goal through the form', async () => {
    mockState = {
      data: [{ id: '1', title: 'Learn Korean', description: 'Conversation', category: 'Languages', progress: 2, target: 10, unit: 'sessions', status: 'active' }],
      isLoading: false,
      isError: false,
    };
    mockMutateAsync.mockResolvedValue({ goal: {} });
    const screen = render(<GoalsScreen />);
    expect(screen.getByText('Learn Korean')).toBeTruthy();
    fireEvent.press(screen.getByRole('button', { name: 'Create goal' }));
    fireEvent.changeText(screen.getByLabelText('Title'), 'Run a 10K');
    fireEvent.changeText(screen.getByLabelText('Category'), 'Fitness');
    fireEvent.changeText(screen.getByLabelText('Target'), '10');
    fireEvent.changeText(screen.getByLabelText('Unit'), 'weeks');
    fireEvent.press(screen.getByRole('button', { name: 'Save goal' }));
    await waitFor(() => expect(mockMutateAsync).toHaveBeenCalledWith({
      title: 'Run a 10K',
      description: '',
      category: 'Fitness',
      target: 10,
      unit: 'weeks',
    }));
  });
});

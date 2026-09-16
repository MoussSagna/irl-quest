import { render } from '@testing-library/react-native';
import { AchievementBadge, LevelBadge, ProgressBar, StreakBadge, XPBar } from '../Progression';

describe('progression components', () => {
  it('exposes clamped progress values for accessibility', () => {
    expect(render(<ProgressBar value={0} />).getByRole('progressbar').props.accessibilityValue.now).toBe(0);
    expect(render(<ProgressBar value={1.4} />).getByRole('progressbar').props.accessibilityValue.now).toBe(1);
  });

  it('renders XP, level, and streak information', () => {
    const screen = render(<><XPBar current={680} needed={1000} /><LevelBadge level={7} /><StreakBadge days={12} /></>);

    expect(screen.getByLabelText('680 of 1000 XP')).toBeTruthy();
    expect(screen.getByText('7')).toBeTruthy();
    expect(screen.getByLabelText('12 day streak')).toBeTruthy();
  });

  it('communicates unlocked and locked achievements', () => {
    const screen = render(<><AchievementBadge title="First quest" /><AchievementBadge title="Hidden quest" unlocked={false} /></>);

    expect(screen.getByLabelText('First quest, unlocked')).toBeTruthy();
    expect(screen.getByLabelText('Hidden quest, locked')).toBeTruthy();
  });
});

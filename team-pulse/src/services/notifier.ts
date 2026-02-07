import notifier from 'node-notifier';

export function notifyStagnation(issue: {
  key: string;
  daysInStatus: number;
}) {
  notifier.notify({
    title: '🚨 Stagnation Alert',
    message: `${issue.key} is stuck (${Math.floor(issue.daysInStatus)} days)`,
    sound: true,
  });
}

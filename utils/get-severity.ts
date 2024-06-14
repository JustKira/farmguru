import { Severity } from '~/types/global.types';

interface Actions {
  [key: string]: (() => any) | any;
}

// The function definition
export default function getSeverity(severity: Severity, actions: Actions): any {
  const action = actions[severity];
  if (typeof action === 'function') {
    return action();
  } else if (action !== undefined) {
    return action;
  } else {
    return 'Default case not handled';
  }
}

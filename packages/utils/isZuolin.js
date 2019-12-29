import { localStorage } from './index';

export default () => {
  if (localStorage.read('ownerType').match(/^EhZuolinAdmins$/)) return true;
  else return false;
};

import { flag } from 'flags/next';
 
export const stampListPageFlag = flag({
  key: 'stamp-list-page',
  decide() {
    return false;
  },
});
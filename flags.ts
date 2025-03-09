import { flag } from 'flags/next';
 
export const stampListPageFlag = flag({
  key: 'stamp-list-page',
  decide() {
    return !!process.env.FEATURE_FLAG_STAMPS_PAGE;
  },
});
 
export const mapPageFlag = flag({
  key: 'stamp-list-page',
  decide() {
    return !!process.env.FEATURE_FLAG_MAP_PAGE;
  },
});
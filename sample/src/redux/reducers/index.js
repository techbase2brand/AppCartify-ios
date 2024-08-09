import { combineReducers } from 'redux';
import wishlistReducer from './wishListReducer';
import authReducer from './authReducer';
import cartReducer from './cartReducer';
import menuReducer from './menuReducer';
import videoReducer from './videoReducer';
import cachedFilesReducer from './cachedFilesReducer';

const rootReducer = combineReducers({
  wishlist: wishlistReducer,
  auth: authReducer,
  cart: cartReducer,
  menu: menuReducer,
  videos: videoReducer,
  cachedFiles: cachedFilesReducer,
});

export default rootReducer;

import BookmarkService from "./bookmarkService";
import BookmarkMockDS from "./datasources/bookmarkMockDS";
import {
    UserMockService
} from "./user-service";

const userService = new UserMockService();
const bookmarkService = new BookmarkService(new BookmarkMockDS);

export {
    userService,
    bookmarkService
};
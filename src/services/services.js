import BookmarkService from "./bookmarkService";
import BookmarkMockDS from "./datasources/bookmarkMockDS";
import TagMockDS from "./datasources/tagMockDS";
import TagService from "./tagService";
import { UserMockService } from "./user-service";

const userService = new UserMockService();
const bookmarkService = new BookmarkService(new BookmarkMockDS());
const tagService = new TagService(new TagMockDS());

export { userService, bookmarkService, tagService };

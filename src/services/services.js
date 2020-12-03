import BookmarkService from "./bookmarkService";
import BookmarkMockDS from "./datasources/bookmarkMockDS";
import TagMockDS from "./datasources/tagMockDS";
import DirectorService from "./director-service";
import MovieService from "./movie-service";
import TagService from "./tagService";
import { UserService } from "./user-service";
import WriterService from "./writer-service";

const userService = new UserService();
const directorService = new DirectorService();
const writerService = new WriterService();
const movieService = new MovieService();
const bookmarkService = new BookmarkService(new BookmarkMockDS());
const tagService = new TagService(new TagMockDS());

export {
  userService,
  directorService,
  writerService,
  movieService,
  bookmarkService,
  tagService,
};

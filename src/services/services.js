import BookmarkService from "./bookmark-service";
import DirectorService from "./director-service";
import MovieService from "./movie-service";
import { UserService } from "./user-service";
import WriterService from "./writer-service";

const userService = new UserService();
const directorService = new DirectorService();
const writerService = new WriterService();
const movieService = new MovieService();
const bookmarkService = new BookmarkService();

export {
  userService,
  directorService,
  writerService,
  movieService,
  bookmarkService,
};

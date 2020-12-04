import axios from "../configuration/axios";
import { getArrayFromString } from "../utilities/utils";
import { directorService, writerService } from "./services";

export default class MovieService {
  async get(id) {
    return axios.get(`/movies/${id}`);
  }

  async getByImdb(imdbId) {
    return axios.get(`/movies?imdbId=${imdbId}`);
  }

  async add(movieItem) {
    debugger;
    //first check if movie exist
    let movie = (await this.getByImdb(movieItem.imdbId)).data;
    //create movie
    if (movie == false) {
      const newMovie = {
        ...movieItem,
        directors: [],
        writers: [],
      };
      // check directors
      for (let directorName of getArrayFromString(movieItem.directors)) {
        let director = (await directorService.getByName(directorName)).data;
        if (director == false) {
          // create director
          const director = (await directorService.add(directorName)).data;
          // push id to directors
          newMovie.directors.push(director._id);
        } else {
          newMovie.directors.push(director[0]._id);
        }
      }
      for (let writerName of getArrayFromString(movieItem.writers)) {
        let writer = (await writerService.getByName(writerName)).data;
        if (writer == false) {
          // create director
          const writer = (await writerService.add(writerName)).data;
          // push id to directors
          newMovie.writers.push(writer._id);
        } else {
          newMovie.writers.push(writer[0]._id);
        }
      }
      // create movie
      movie = (await axios.post("/movies", newMovie)).data;
    } else {
      movie = movie[0];
    }
    return movie;
  }
}

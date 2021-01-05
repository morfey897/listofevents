import { fetchEvent, fetchCategory } from "../model/actions";
import Service from "./service";
import { SCREENS } from "../enums";

class UrlCheckService extends Service {

  run() {
    return new Promise((resolve) => {
      const window_location = (window && window.location);
      let link = window_location && window_location.pathname;
      if (link && link.indexOf(SCREENS.CATEGORY) == 0) {
        fetchCategory({ url: link.replace(SCREENS.CATEGORY, "") })
          .then((result) => {
            resolve({ [this.name]: result });
          });
      } else if (link && !Object.values(SCREENS).some((url) => url == link)) {
        fetchEvent({ url: link })
          .then((result) => {
            resolve({ [this.name]: result });
          });
      } else {
        resolve({ [this.name]: {} });
      }
    });
  }
}

export default UrlCheckService;
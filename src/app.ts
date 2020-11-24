import Express from 'express';
import { applyRoutes } from './routes';

if (process.env.NODE_ENV === 'development' || process.env.NODE_ENV == null) {
  require('dotenv').config();
}

(async () => {
  const app = applyRoutes(Express());
  app.listen(process.env.PORT || 3000, () => {
    console.log(`listening on localhost:${process.env.PORT || 3000}`);
  });
})();

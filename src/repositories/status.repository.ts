import db from "../db/db";
import { statuses } from "../db/schema";

const StatusRepository = {
  get: async () => {
    return db.select().from(statuses);
  },
};

export default StatusRepository;

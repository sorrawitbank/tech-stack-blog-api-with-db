import db from "../db/db.ts";
import { statuses } from "../db/schema.ts";

const StatusRepository = {
  get: async () => {
    return await db.select().from(statuses);
  },
};

export default StatusRepository;

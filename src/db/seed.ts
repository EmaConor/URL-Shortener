import { db, connection } from "./index"
import * as seeds from "./seeds"

await seeds.plan(db)
await seeds.demoUser(db)

await connection.end()
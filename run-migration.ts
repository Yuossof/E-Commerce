import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from 'url'
import sql from "./src/config/db"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export async function migrate() {
    const folderPath = path.join(__dirname, './migrations');

    const files = (await fs.readdir(folderPath))
        .filter((file) => path.extname(file).toLowerCase() === ".sql")
        .sort((a, b) => {
            const aNumber = Number.parseInt(a, 10)
            const bNumber = Number.parseInt(b, 10)

            if (Number.isNaN(aNumber) || Number.isNaN(bNumber)) {
                return a.localeCompare(b)
            }

            return aNumber - bNumber
        })

    for (let i = 0; i < files.length; i++) {
        const file = files[i]
        const filePath = path.join(folderPath, file)
        console.log(filePath)

        const data = await fs.readFile(filePath, "utf-8")
        await sql.unsafe(data)
        console.log(`Executed: ${file}`)
    }
}

migrate()
    .then(() => {
        console.log("Migration completed successfully!");
        process.exit(0);
    })
    .catch((err) => {
        console.error("Migration failed:", err);
        process.exit(1);
    });
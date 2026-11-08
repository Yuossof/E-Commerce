import multer from "multer"

export const upload = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize: 10 * 1024 * 1024,
        files: 16
    },
    fileFilter: (_req, file, callback) => {
        if (!file.mimetype.startsWith("image/")) {
            callback(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname))
            return
        }

        callback(null, true)
    }
})

const Router = require('koa-router');
const multer = require('@koa/multer');
const sharp = require("sharp");
const path = require("path");
const { getOrientation } = require("get-orientation")
const fs = require("fs");

const router = new Router();

sharp.cache(false);

const upload = multer({
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            cb(null, 'upload/');
        },
        filename: (req, file, cb) => {
            let newFileName = new Date().valueOf() + path.extname(file.originalname);
            cb(null, newFileName);
        }
    }),
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith('image')) {
            cb(null, true);
        } else {
            cb({data: "is.not.image.type"}, false);
        }
    }
});

router.post('/upload/image', upload.single('file'), async (ctx) => {
    if (!ctx.request.file) {
        throw new Error('file.not.found');
    }

    let newFileName = new Date().valueOf() + ".webp";

    try {
        const filePath = ctx.request.file.path;

        const bufFile = fs.readFileSync(filePath);
        const orientation = await getOrientation(bufFile)

        let rotate = 0;
        let horizontal = false;
        let vertical = false;

        if ([2, 5, 7].includes(orientation)) {
            horizontal = true;
        } else if (orientation === 4) {
            vertical = true;
        }

        if (orientation === 3) {
            rotate = 180;
        } else if (orientation === 6) {
            rotate = 90;
        } else if (orientation === 8) {
            rotate = 270;
        }

        await sharp(filePath, {animated: false})
            .withMetadata()
            .webp({quality: 70})
            .rotate(rotate)
            .flip(vertical)
            .flop(horizontal)
            .toFile("D://images/" + newFileName)
            .then(() =>  {
                fs.unlink(filePath, (err) => {
                    if (err) throw err;
                })
            })

        ctx.body = {
            data: {
                fileName: newFileName
            },
            message: 'Upload Success'
        };
    } catch (err) {
        throw new Error('Unknown Error');
    }
});

module.exports = router;
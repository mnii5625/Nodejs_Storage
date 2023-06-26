const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
const router = new Router();
const ImageUploadRoute = require('./routes/ImageUploadRoute');
const ImageDownloadRoute = require('./routes/ImageDownloadRoute');

router.get('/', (ctx) => {
    ctx.body = '안녕하세요. \n개발자 김민기의 Storage Server 입니다.';
})

app.use(async(ctx, next) => {
    try {
        await next();
    } catch (err) {
        console.log('Error Start =====')
        console.log(err)
        console.log('Error End =====')
        if (err.data === 'is.not.image.type') {
            ctx.status = 415;
            ctx.body = {
                data: {},
                message: 'This format is not supported'
            };
        } else if (err.name === 'MulterError') {
            ctx.status = 400;
            ctx.body = {
                data: {},
                message: 'Upload Failed'
            };
        } else if (err.message === 'file.not.found') {
            ctx.status = 400;
            ctx.body = {
                data: {},
                message: 'File not found'
            };
        } else {
            ctx.status = 500;
            ctx.body = {
                data: {},
                message: 'Internal Server Error'
            };
        }
    }
})

app.use(router.routes()).use(router.allowedMethods());
app.use(ImageUploadRoute.routes()).use(ImageUploadRoute.allowedMethods());
app.use(ImageDownloadRoute.routes()).use(ImageDownloadRoute.allowedMethods());

app.listen(2000, () => {
    console.log('Storage Server is listening to port 2000');
})

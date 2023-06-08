const Router = require('koa-router');
const router = new Router();

const fs = require('fs');
const Path = require('path');

module.exports = router;

router.get('/images/:name', async (ctx) => {
    const { name } = ctx.params;
    ctx.set("Content-Type", "image/webp");
    ctx.body = fs.readFileSync(Path.join("D://images/" + name));
});
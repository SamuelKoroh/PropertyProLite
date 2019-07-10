import app from './app';

const port = process.env.PORT || 3500;
const server = app.listen(port);
export default server;

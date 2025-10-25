export default {
    server: {
        host: "localhost",
        port: 3000,
        dbPath: "./data.json",
        authSecret: 'secret',
    },
    static: {
        host: "localhost", 
        port: 3001, 
        path: "./dist/webpack",
    },
};
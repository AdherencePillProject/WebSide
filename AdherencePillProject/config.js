var config = {
    Parse: {
        databaseURI: 'mongodb://129.105.36.93:27017/adherence',
        cloud: './cloud/index.js',
        appId: 'AdherencePillProject',
        masterKey: 'AdherenceServer',
        serverURL: 'http://localhost:5000/parse',
        liveQuery: {
            classNames: ["Posts", "Comments"]
        }
    }
};

module.exports = config;
module.exports = {
    "presets": [
        [
            "@babel/preset-env",
            {
                "targets": "defaults"
            }
        ],
        [
            "@babel/preset-react",
            {
                "runtime": "automatic"
            }
        ]
    ],
    "plugins": [
        [
            "babel-plugin-import",
            {
                "libraryName": "@material-ui/core",
                "libraryDirectory": "esm",
                "camel2DashComponentName": false
            },
            "core"
        ],
        [
            "babel-plugin-import",
            {
                "libraryName": "@material-ui/icons",
                "libraryDirectory": "esm",
                "camel2DashComponentName": false
            },
            "icons"
        ],
        [
            "babel-plugin-import",
            {
                "libraryName": "@material-ui/lab",
                "libraryDirectory": "esm",
                "camel2DashComponentName": false,
            },
            "labs"
        ]
    ]
};
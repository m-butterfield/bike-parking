({
    baseUrl: ".",
    name: 'main',
    paths: {
        "backbone": '../vendor/backbone',
        "bootstrap": '../vendor/bootstrap',
        "domReady": '../vendor/domReady',
        "jquery": '../vendor/jquery',
        "text": '../vendor/text',
        "underscore": '../vendor/underscore'
    },
    "shim": {
        "bootstrap": ["jquery"]
    },
    removeCombined: false,
    out: 'main-build.js',
    findNestedDependencies: true
})

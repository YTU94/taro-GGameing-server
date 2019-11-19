var createError = require("http-errors")
var express = require("express")
var path = require("path")
// var cookieParser = require('cookie-parser');
// var logger = require('morgan');

var indexRouter = require("./app/index")

var debug = require("debug")("myapp:server")
var http = require("http")

const createNamespace = require("cls-hooked").createNamespace
const pino = require("pino")
const uuidv4 = require("uuid/v4")

const clsProxifyNamespace = createNamespace("app")

const clsProxify = (clsKey, targetToProxify) => {
    const proxified = new Proxy(targetToProxify, {
        get(target, property, receiver) {
            target = clsProxifyNamespace.get(clsKey) || target
            return Reflect.get(target, property, receiver)
        },
        construct(target, args) {
            target = clsProxifyNamespace.get(clsKey) || target
            return Reflect.construct(target, args)
        }
    })
    return proxified
}

// const logger = { info: msg => console.log(msg) }
const logger = pino()

// const loggerCls = clsProxify("clsKeyLogger", logger)

var app = express()

const createClsProxy = req => {
    const headerRequestID = req.headers.traceparent
    const loggerProxy = {
        info: msg => `${headerRequestID}: ${msg}`
    }
    // this value will be accesible in CLS by key 'clsKeyLogger'
    // it will be used as a proxy for `loggerCls`
    return loggerProxy
}

// app.use(clsMiddleware)
const clsProxifyExpressMiddleware = (clsKey, createClsProxy) => (req, res, next) => {
    clsProxifyNamespace.bindEmitter(req)
    clsProxifyNamespace.bindEmitter(res)

    const traceID = uuidv4()
    console.log(traceID, "traceID")
    const loggerWithTraceId = logger.child({ traceID })

    clsProxifyNamespace.run(() => {
        const proxyValue = createClsProxy(req, res)
        clsProxifyNamespace.set("clsKeyLogger", proxyValue)

        next()
    })
}

const loggerCls = new Proxy(logger, {
    get(target, property, receiver) {
        // Fallback to our original logger if there is no child logger in CLS
        target = clsProxifyNamespace.get("loggerCls") || target
        return Reflect.get(target, property, receiver)
    }
})
const clsMiddleware = (req, res, next) => {
    // req and res are event emitters. We want to access CLS context inside of their event callbacks
    clsProxifyNamespace.bind(req)
    clsProxifyNamespace.bind(res)

    const traceID = uuidv4()
    const loggerWithTraceId = logger.child({ traceID })
    clsProxifyNamespace.run(() => {
        clsProxifyNamespace.set("loggerCls", loggerWithTraceId)

        next()
    })
}

//
// app.use(clsProxifyExpressMiddleware("clsKeyLogger", createClsProxy))
app.use(clsMiddleware)
app.get("/test", (req, res) => {
    console.log("object", loggerCls)
    loggerCls.info("My message!")
    res.json({})
    // Logs `${headerRequestID}: My message!` into the console
    // Say, we send GET /test with header 'Traceparent' set to 12345
    // It's going to log '12345: My message!'s
    // If it doesn't find anything in CLS by key 'clsKeyLogger' it uses the original `logger` and logs 'My message!'
})

const fs = require("fs")
const Busboy = require("busboy")
// const sideThread = require("./sideThread")

// sideThread.parseJSAsync().then(res => {
//     console.log("object", res)
// })
// sideThread()
// console.log(sideThread, typeof sideThread)

const assert = require("assert")
app.get("/", (req, res) => res.send("Hello World!"))
//使用express框架自带的static中间件，用来管理静态资源
app.use("/", express.static(__dirname + "/"))
//上传文件必须是post方式并且需要指定上传的路径
const allowHeaders =
    "Origin, No-Cache, X-Requested-With, If-Modified-Since, Pragma, Last-Modified, Cache-Control, Expires, Content-Type, X-E4M-With, Authorization"

app.all("*", function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    //Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
    res.header("Access-Control-Allow-Headers", allowHeaders)
    res.header("Access-Control-Allow-Methods", "*")
    res.header("Content-Type", "application/json;charset=utf-8")
    next()
})

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

// app.use(logger('dev'));
app.use(express.json())
app.use(
    express.urlencoded({
        extended: false
    })
)
// app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")))

app.use(indexRouter)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404))
})

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get("env") === "development" ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render("error")
})

// #!/usr/bin/env node

/**
 * Module dependencies.
 */

// var app = require('../app');

/**
 * Get port from environment and store in Express.
 */

var port = normalizePort(process.env.PORT || "3001")
app.set("port", port)

/**
 * Create HTTP server.
 */

var server = http.createServer(app)

/**
 * Listen on provided port, on all network interfaces.
 */

console.log("Express app started on port " + port)

server.listen(port, "0.0.0.0")
server.on("error", onError)
server.on("listening", onListening)

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
    var port = parseInt(val, 10)

    if (isNaN(port)) {
        // named pipe
        return val
    }

    if (port >= 0) {
        // port number
        return port
    }

    return false
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
    if (error.syscall !== "listen") {
        throw error
    }

    var bind = typeof port === "string" ? "Pipe " + port : "Port " + port

    // handle specific listen errors with friendly messages
    switch (error.code) {
        case "EACCES":
            console.error(bind + " requires elevated privileges")
            process.exit(1)
            break
        case "EADDRINUSE":
            console.error(bind + " is already in use")
            process.exit(1)
            break
        default:
            throw error
    }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
    var addr = server.address()
    var bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port
    debug("Listening on " + bind)
}

// sideThread()

const { isMainThread, parentPort, workerData, threadId, MessageChannel, MessagePort, Worker } = require("worker_threads")

function mainThread() {
    const worker = new Worker(__filename, { workerData: 0 })
    worker.on("exit", code => {
        console.log(`main: worker stopped with exit code ${code}`)
    })
    worker.on("message", msg => {
        console.log(`main: receive ${msg}`)
        worker.postMessage(msg + 1)
    })
}

function workerThread() {
    console.log(`worker: __________ threadId ${threadId} start with ${__filename}`)
    console.log(`worker: workerDate -> ${workerData}`)
    parentPort.on("message", msg => {
        console.log(`worker: receive ${msg}`)
        if (msg === 5) {
            process.exit()
        }
        parentPort.postMessage(msg)
    }),
        parentPort.postMessage(workerData)
}

if (isMainThread) {
    mainThread()
} else {
    workerThread()
}

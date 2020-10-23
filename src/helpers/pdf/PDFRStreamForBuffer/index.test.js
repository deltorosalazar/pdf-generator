/**
 * @jest-environment node
 */
const PDFRStreamForBuffer = require("./index").PDFRStreamForBuffer

describe("PDFRStreamForBuffer", ()=>{
    test("getCurrentPosition", ()=>{
        let streamForBuffer = new PDFRStreamForBuffer(new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))
        let res = streamForBuffer.getCurrentPosition()
        expect(res).toBe(0)
    })
    test("skip", ()=>{
        let streamForBuffer = new PDFRStreamForBuffer(new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))
        streamForBuffer.skip(2)
        let res = streamForBuffer.getCurrentPosition()
        expect(res).toBe(2)
    })
    test("setPositionFromEnd", ()=>{
        let buffer = new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72])
        let streamForBuffer = new PDFRStreamForBuffer(buffer)
        streamForBuffer.setPositionFromEnd(2)
        let res = streamForBuffer.getCurrentPosition()
        expect(res).toBe(buffer.byteLength-2)
    })
    test("setPosition", ()=>{
        let streamForBuffer = new PDFRStreamForBuffer(new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))
        streamForBuffer.setPosition(2)
        let res = streamForBuffer.getCurrentPosition()
        expect(res).toBe(2)
    })
    test("notEnded", ()=>{
        let streamForBuffer = new PDFRStreamForBuffer(new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))
        let res = streamForBuffer.notEnded()
        expect(res).toBe(true)
    })
    test("read", ()=>{
        let streamForBuffer = new PDFRStreamForBuffer(new Buffer([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]))
        let res = streamForBuffer.read(3)
        expect(res).toEqual([ 98, 117, 102 ])
    })
})
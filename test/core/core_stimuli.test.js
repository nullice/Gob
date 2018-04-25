// Created by nullice on 2018/04/17 - 17:55 

import Gob from "./../../dist/Gob.umd.js"


describe("$get, $set", () =>
{
    test("$get", () =>
        {
            let gob = Gob()
            gob.x = "123"
            expect(gob.$get("x")).toBe("123")

            gob.x = {a: {b: 55}}
            expect(gob.$get("x.a.b")).toBe(55)

            gob.x = {a: {b: 55}}
            expect(gob.$get("x.a")).toEqual({b: 55})

            gob.e = {a: {b: undefined}}
            expect(gob.$get("e.a.b")).toBe(undefined)
        }
    )
    test("$set", () =>
        {
            let gob = Gob()
            gob.$set(["x"], "123")
            expect(gob.$get("x")).toBe("123")

            gob.$set(["x"], {a: {b: 55}})
            expect(gob.$get("x.a.b")).toBe(55)

            gob.$set(["x"], {a: {b: 55}})
            expect(gob.$get("x.a")).toEqual({b: 55})

            gob.$set(["e"], {a: {b: undefined}})
            expect(gob.$get("e.a.b")).toBe(undefined)
        }
    )
})

describe("StimuliBus Log", () =>
{
    let gob = Gob()
    let core = Gob.inspect(gob)


    test("getLatestStimuliSign raw get", () =>
        {
            gob.a
            var sign = core.stimuliBus.getLatestStimuliSign()
            expect(sign.type).toBe("get")
            expect(sign.path).toEqual(["a"])

        }
    )

    test("stimuliLog.indexes", () =>
        {
            expect(core.stimuliBus.stimuliLog.indexes.all).toBe(1)
            expect(core.stimuliBus.stimuliLog.indexes.get).toBe(1)
            expect(core.stimuliBus.stimuliLog.indexes.set).toBe(0)
            expect(core.stimuliBus.stimuliLog.indexes.delete).toBe(0)
        }
    )

    test("getLatestStimuliSign $get", () =>
        {
            gob.$get(["a"])
            var sign = core.stimuliBus.getLatestStimuliSign()
            expect(sign.type).toBe("get")
            expect(sign.path).toEqual(["a"])

        }
    )

    test("stimuliLog.indexes", () =>
        {
            expect(core.stimuliBus.stimuliLog.indexes.all).toBe(2)
            expect(core.stimuliBus.stimuliLog.indexes.get).toBe(2)
            expect(core.stimuliBus.stimuliLog.indexes.set).toBe(0)
            expect(core.stimuliBus.stimuliLog.indexes.delete).toBe(0)
        }
    )

    test("getLatestStimuliSign $set", () =>
        {
            gob.$set(["o"], {a: {b: 123}})
            var sign = core.stimuliBus.getLatestStimuliSign()
            expect(sign.type).toBe("set")
            expect(sign.path).toEqual(["o"])

        }
    )

    test("stimuliLog.indexes", () =>
        {
            expect(core.stimuliBus.stimuliLog.indexes.all).toBe(3)
            expect(core.stimuliBus.stimuliLog.indexes.get).toBe(2)
            expect(core.stimuliBus.stimuliLog.indexes.set).toBe(1)
            expect(core.stimuliBus.stimuliLog.indexes.delete).toBe(0)
        }
    )

})

// Created by nullice on 2018/05/02 - 16:27


import Gob from "./../../dist/Gob.umd.js"

const GOB_CORE_NAME = "[Gob Core]"

describe("Array base", () =>
{
    var gob = Gob()


    test("gob.arr = Array", () =>
    {
        gob.arr = [1, 2, 3]
        expect(gob.arr[0]).toBe(1)
        expect(gob.arr[1]).toBe(2)
        expect(gob.arr[2]).toBe(3)
        expect(gob.arr.length).toBe(3)
    })

    test("gob.Array.push()", () =>
    {
        gob.arr2 = [1]
        expect(gob.arr2[0]).toBe(1)
        gob.arr2.push("aaa")
        expect(gob.arr2[1]).toBe("aaa")
        gob.arr2.push({ob:{obb:123}})
        expect( gob.arr2[2].ob.obb).toBe(123)
        gob.arr2[2].ob.obb=444
        var core = Gob.inspect(gob)
        var sign = core.stimuliBus.getLatestStimuliSign()
        expect(sign.type).toBe("set")
    })
})

/**
 * Created by nullice on 2017/5/15.
 */
/*
 npm test -- --watch
 */

import test from 'ava';
import GOB from './../bin/Gob.umd.js';

test('创建属性', t =>
{
    var Gob = new GOB()
    Gob.$new({d1: 22, ds: 22})
    t.is(Gob.d1, 22);
    t.is(Gob.ds, 22);

});


test('创建对象属性', t =>
{
    var Gob = new GOB()
    Gob.$new({
        a: {
            a2: {a3: 333},
            a222: 222
        }, a222: 222,
        b: {b2: {b3: 444}}
    })
    t.is(Gob.a.a2.a3, 333);
    t.is(Gob.a222, 222);
    t.is(Gob.b.b2.b3, 444);
});


test('设置属性', t =>
{
    var Gob = new GOB()
    Gob.$new({
        a: {
            a2: {a3: 333},
            a222: 222
        }, a222: 222,
        b: {b2: {b3: 444}}
    })
    Gob.a.a2.a3 = "ssss";
    Gob.b.b2.b3 = 223322;
    Gob.a222 = {value: 222}

    t.is(Gob.a222.value, 222);
    t.is(Gob.b.b2.b3, 223322);
    t.is(Gob.a.a2.a3, "ssss");
    Gob.$setValue("a.a2.a3",2312)
    t.is(Gob.a.a2.a3, 2312);
    Gob.$setValue("a/a2/a3",23)
    t.is(Gob.a.a2.a3, 23);
    Gob.$setValue("a\\a2\\a3",55)
    t.is(Gob.a.a2.a3, 55);



});


test('设置新属性', t =>
{
    var Gob = new GOB()
    Gob.$new({
        a: {
            a2: {a3: 333},
            a222: 222
        }, a222: 222,
        b: {b2: {b3: 444}}
    })

    Gob.$new({
        a: {
            a2: {a3aa: 666},
        }
    })

    t.is(Gob.a.a2.a3aa, 666);
    Gob.a.a2.a3aa = 445
    t.is(Gob.a.a2.a3aa, 445);

    Gob.$new(["a", "b", "c"], 999)
    t.is(Gob.a.b.c, 999);

    Gob.a.a2.a3aa={t1:12345,t2:{tyy:123}}
    t.is(Gob.a.a2.a3aa.t1, 12345);
    t.is(Gob.a.a2.a3aa.t2.tyy, 123);



});


test('同步过滤器', t =>
{
    var Gob = new GOB()
    Gob.$new({
        ui: {
            windowA: true,
            windowB: false,
            toolLen: 23,
            msg: {
                a: "ttttt",
                b: "bbbbb",
                c: "ccccc"
            },
            note: {
                t1: "t111",
                t2: "t222"
            }
        },
        user: {title: "isTitle"}
    })

    //fitlerType, filterName, filterFunction, keyPath, level, isAsync
    Gob.$addFilter("pre", "addStrAll", function (oldValue, newValue, keys)
    {
        return "[root]" + newValue
    }, [])

    Gob.$addFilter({
        fitlerType: "pre",
        filterName: "getLength",
        filterFunction: function (oldValue, newValue, keys)
        {
            if (keys[keys.length - 1] === "toolLen")
            {
                return newValue.length
            }
            return newValue
        },
        keyPath: ["ui"],
        level: 8
    })

    Gob.$addFilter({
        fitlerType: "pre",
        filterName: "ui",
        filterFunction: function (oldValue, newValue, keys)
        {

            return "[ui]" + newValue
        },
        keyPath: ["ui"],
        level: 99
    })

    var DD1 = 0
    Gob.$addFilter({
        fitlerType: "fin",
        filterName: "ui",
        filterFunction: function (oldValue, newValue, keys)
        {

            return "[ui]" + newValue
        },
        keyPath: ["ui"],
        level: 99
    })

    Gob.ui.msg.a = "aaa"
    t.is(Gob.ui.msg.a, "[ui][root]aaa");

    Gob.user.title = "newTitle"
    t.is(Gob.user.title, "[root]newTitle");

    Gob.ui.toolLen = "555"
    t.is(Gob.ui.toolLen, "[ui][root]666".length);
});


test('异步过滤器', t =>
{
    var Gob = new GOB()
    Gob.$new({
        ui: {
            windowA: true,
            windowB: false,
            toolLen: 23,
            msg: {
                a: "ttttt",
                b: "bbbbb",
                c: "ccccc"
            },
            note: {
                t1: "t111",
                t2: "t222"
            }
        },
        user: {title: "isTitle"}
    })
    //fitlerType, filterName, filterFunction, keyPath, level, isAsync
    Gob.$addFilter("pre", "addStrAll", async function (oldValue, newValue, keys)
    {
        return "[async]" + newValue
    }, [])


    Gob.ui.msg.a = "aaa"
    t.is(Gob.ui.msg.a, "ttttt");

    setTimeout(() =>
    {
        t.is(Gob.ui.msg.a, "aaa");
    })

});


// test('执行指令', t =>
// {
//     var Gob = new GOB()
//     var ordersJson =
//
//
//
//     var orders = JSON.parse(ordersJson)
//     Gob.$exec(orders)
//     t.is(Gob.ob2.d2, "ddd");
//     t.is(Gob.ob2.ob22.d, 3324);
//     Gob.$exec({order: "new", info: {keyPath: ["tt", "tt2", "sd22"], value: 3322}})
//     t.is(Gob.tt.tt2.sd22, 3322);
//     Gob.tt.tt2.sd22 = "ddd"
//     t.is(Gob.tt.tt2.sd22, "ddd");
//
// });


test('示例1', t =>
{
    var Gob = new GOB()
    Gob.$new({
        text: {fontSize: 14}
    })
    Gob.text.fontSize = 24;
    t.is(Gob.text.fontSize, 24);
    Gob.$setValue(["text", "fontSize"], 32)
    t.is(Gob.text.fontSize, 32);

});


test('bar', async t =>
{
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});

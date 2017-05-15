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
    Gob.$newStates({d1: 22, ds: 22})
    t.is(Gob.d1, 22);
    t.is(Gob.ds, 22);

});


test('创建对象属性', t =>
{
    var Gob = new GOB()
    Gob.$newStates({
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
    Gob.$newStates({
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
});


test('同步过滤器', t =>
{

    var Gob = new GOB()
    Gob.$newStates({
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
        filterName: "keepType",
        filterFunction: function (oldValue, newValue, keys)
        {
            return oldValue.constructor(newValue)
        },
        keyPath: ["ui"],
        level: 3
    })

    Gob.$addFilter({
        fitlerType: "pre",
        filterName: "ui",
        filterFunction: function (oldValue, newValue, keys)
        {
            return "[ui]" + newValue
        },
        keyPath:["ui"],
        level:3
    })

    Gob.user.title = "newTitle"
    t.is(Gob.user.title, "[root]newTitle");


    Gob.ui.toolLen = "555"
    t.is(Gob.ui.toolLen, 555);
});


test('bar', async t =>
{
    const bar = Promise.resolve('bar');

    t.is(await bar, 'bar');
});

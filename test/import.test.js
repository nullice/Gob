// Created by nullice on 2018/04/11 - 19:44

const LIB_NAME = require("./../package.json").fullName

const CJS_PATH = "./../dist/" + LIB_NAME + ".cjs.js"
const ES_PATH = "./../dist/" + LIB_NAME + ".es.js"
const UMD_PATH = "./../dist/" + LIB_NAME + ".umd.js"
const BUNDLE_WEB_PATH = "./../dist/" + LIB_NAME + ".bundle-web.js"
const BUNDLE_NODE_PATH = "./../dist/" + LIB_NAME + ".bundle-node.js"


import lib_es from "./../dist/Gob.es.js"
const  rc = require("richang.js/dist/RichangNode.js")

let lib_cjs = require(CJS_PATH)
let lib_umd = require(UMD_PATH)
let lib_bundle_web = require(BUNDLE_WEB_PATH)
let lib_bundle_node = require(BUNDLE_NODE_PATH)

const GOB_CORE_NAME = "[Gob Core]"


test("import es.js", () =>
{
    expect(typeof  (lib_es()[GOB_CORE_NAME])).toBe("object")

})

test("import cjs.js", () =>
{
    expect(typeof  (lib_cjs()[GOB_CORE_NAME])).toBe("object")
})

test("import umd.js", () =>
{
    expect(typeof  (lib_umd()[GOB_CORE_NAME])).toBe("object")
})

test("import bundle-node.js", () =>
{
    expect(typeof  (lib_bundle_node()[GOB_CORE_NAME])).toBe("object")

})
test("import bundle-web.js", () =>
{
    expect(typeof  (lib_bundle_web()[GOB_CORE_NAME])).toBe("object")
})

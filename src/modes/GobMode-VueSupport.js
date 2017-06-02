/**
 * Created by nullice on 2017/5/18.
 */
var GobMode_VueSupport_init = function (vue)
{
    if (vue != undefined)
    {
        return function ()
        {
            var Vue = vue
            init(this)
        }
    } else
    {
        init(this)
    }

    function init(self)
    {
        console.log("[Gob Mode:VueSupport]")
        //为新创建对象在 vue 上添加响应支持
        self.$_entrails.hooks.newState =
            function (object, key, value, keys)
            {
                Vue.util.defineReactive(object, key, value,)
            }

        self.$_entrails.hooks.OVERWRITE_newStateObject =
            function (object, key, value, keys)
            {
                Vue.set(object, key, value)
            }


        self.$_entrails.hooks.OVERWRITE_deleteState = function (object, key)
        {
            Vue.util.del(object, key)
        }


        //值更新后触发 Vue 的更新
        self.$addFilter("fin", "vueDep", fin_vueDep, [], 10)
    }


}


function fin_vueDep(oldValue, finValue, changed, keys, who, filterRope)
{
    var getObjectValueByKeys = this.$util.getObjectValueByKeys
    var parentOb = getObjectValueByKeys(this, keys.slice(0, keys.length - 1))

    if (parentOb.__ob__ != undefined)
    {
        if (parentOb.__ob__.dep != undefined)
        {
            if (typeof parentOb.__ob__.dep.notify === "function")
            {
                parentOb.__ob__.dep.notify()
            }
        }
    }
}


export  default  GobMode_VueSupport_init

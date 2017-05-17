<p align="center">
  <img  src ="https://github.com/nullice/Gob/raw/master/logo/logo-200.png" />
</p>



# Gob
Simple and Intuitive State Management Base Filter.


这是一个基于过滤器的简单而直观的状态管理工具。
它有一个简单的流程实现对状态的管理：
```
  [动作] -> (前过滤器 -> [状态] -> 终过滤器)
```
<p align="center">
  <img  src ="https://github.com/nullice/Gob/raw/master/logo/过滤器示例.png" />
</p>

它是 Photoshop 扩展 [UI-DNA](https://github.com/nullice/UI-DNA) 中解耦出的库，在 UI-DNA 中状态改变常常需要是一个异步的过程，例如修改一个字体属性，需要等待 Photoshop 中渲染完成后，状态改变才算完成，否则你就无法控制多个状态改变时的顺序，同时还需要对状态改变前对新状态进行处理或者触发一些别的行为。这就需要一个对状态与状态行为进行管理的工具，这就是 Gob。


 Gob 的核心思想是
> - 状态获取（取值）应该是静态（没有行为）的
> - 状态改变（赋值）应该是动态（可以有行为）的
> - 状态改变的过程应该是可精确记录的


```js
    // 创建状态树
    var Gob = new GOB()
    // 应用模式 
    Gob.$use(Gob.$MODES.BASE)

    //定义新状态
    Gob.$newStates({
        text: {
            fontSize: {type: "number", default: 16, range: [12, 72]},
            fontFamily:"Meiryo"
        }
    })

    //这个状态被改变时会被 BASE 模式的过滤器处理
    // 它的值被约束在 range:[12,72]
    Gob.text.fontSize = 333
    console.log( Gob.text.fontSize) // 72

    //添加一个异步过滤器，在状态改变前处理新状态
    Gob.$addFilter("pre", "aAsyncFilter",
         async function (oldValue, newValue, keys, who)
         {
             return await someAsyncProcessing(newValue)
         } ,["text"])

    //控制异步的状态改变过程
    async function asyncAction(){
          await Gob.$setValue(["text", "fontSize"], 32)
          //用 await 保证改变 Gob.text.fontFamily 时，Gob.text.fontSize 已经被改变了
          await Gob.$setValue(["text", "fontFamily"], "Helvetica")
    }
    
```



## 概念

### 键名路径 keyPath
键名路径就是用来确定属性在对象中位置的数组比如`Gob.text.fontSize`的键名路径是： `["text","fontSize"]`。Gob 中改变状态与获取状态的操作在内部都通过键名路径来进行，使用键名路径有几个好处:
- 作为状态的唯一标识
- 知道目标状态位于状态树中的位置，可供路由和过滤器使用
- 可记录与传递改变状态的动作

这些好处对于过滤器来说很重要，当状态改变时，在过滤器中能通过键名路径明确知道是哪个状态被改变，以此进行相应的处理。

```js
    //使用键名路径来改变和获取状态：
    Gob.$setValue(["text", "fontSize"], 32)
    Gob.$getValue(["text", "fontSize"]) //32

    //使用普通的赋值来改变状态时，键名路径也可以被记录下来：
    Gob.text.fontSize = 32

    /*  被记录下来的状态改变指令：
        {
            order:"set", who:undefined,
            info: {"keyPath":["text","fontSize"],"value":32}
        }
    */
```
#### 键名路径的格式
- 数组：`["ui","test","fontSize"]`
- 字符串 点分隔符：`"ui.test.fontSize"`
- 字符串 斜杠分隔符：`"ui/test/fontSize"`

### 过滤器
Gob 的核心思想就是通过滤器来处理状态改变时的所有逻辑。
当一个新值要改变状态时，比如一句赋值语句： `Gob.text.fontSize =16`，或者一个指令方法：`Gob.$setValue(["text", "fontSize"], 16)`,都可以触发一个或多个过滤器，过滤器是串联的，新值在过滤器中处理并传递到下一个过滤器。

#### 过滤器路由
状态改变不会触发所有的过滤器，一个状态改变过程要触发哪些过滤器，由目标状态的键名路径来决定，过滤器有自己“键名路径属性”，例如过滤器的“键名路径属性”是 `["text"]`，它就能匹配所有 `["text"]` 开头的状态，比如`["text", "fontSize"]`、`["text", "lineMax"]`


### 异步 
一个状态改变过程可能会进行各种异步处理，在 Gob 中也就是加入异步的过滤器。Gob 可以自动处理异步过滤器，异步过滤器在触发时依旧是与其它过滤器串联的。

```js

    //创建状态
    Gob.$newStates({
        text: {fontSize: 14, fontFamily:"Meiryo" }
    })
    
    // 添加一个进行异步处理的过滤器
    Gob.$addFilter("pre", "aAsyncFilter",
         async function (oldValue, newValue, keys, who)
         {
             return await someAsyncProcessing(newValue)
         } ,["text"])

   //用 await/async 做异步控制，保证状态按顺序改变
    async function asyncAction(){
          await Gob.$setValue(["text", "fontSize"], 32)
          //用 await 保证改变 Gob.text.fontFamily 时，Gob.text.fontSize 已经被改变了
          await Gob.$setValue(["text", "fontFamily"], "Helvetica")
    }

    //直接用赋值改变状态，每个状态的异步处理会进行，但不能保证每个状态按顺序改变
    Gob.text.fontSize = 24; 
    Gob.text.fontFamily = "Helvetica"; 

``` 

### 模式 mode

模式就是一系列过滤器与状态格式的组合，
```js

 var states ={
    text: {
        fontFamily: {type: "string", default: "微软雅黑"},
        fontSize: {type: "number", default: 32, range: [12, 72]},
        color: {
            r: {type: "number", default: 244, range: [0, 255]},
            g: {type: "number", default: 244, range: [0, 255]},
            b: {type: "number", default: 244, range: [0, 255]},
        },
    }
}


```


```js
的撒发生地方
```

<p align="center">
  <img  src ="https://github.com/nullice/Gob/raw/master/logo/logo-200.png" />
</p>



# Gob
Simple and Intuitive State Management Base Filter.


这是一个基于过滤器的简单而直观的状态管理工具。
它有一个简单的流程实现对状态的管理：
```
  [改变动作] -> (前过滤器 -> [状态] -> 终过滤器)
```


- 状态改变可能会触发异步过程
- 

```js
    var Gob = new GOB()
    
    //创建状态
    Gob.$newStates({
        text: {fontSize: 14}
    })
    
    //普通赋值
    Gob.text.fontSize = 24; 
    
   
    // 添加一个进行异步处理的过滤器
    Gob.$addFilter("pre", "aAsyncFilter",
         async function (oldValue, newValue, keys, who)
         {
             return await someAsyncProces(newValue)
         } ,
         ["text"])
         
   //异步赋值（根据键名路径）
   await Gob.$setValue(["text", "fontSize"], 32)

    
```



## 特性

### 键名路径 keyPath
键名路径就是用来确定属性在对象中位置的数组比如`.text.fontSize`的键名路径是： `["text","fontSize"]`。Gob 中改变状态与获取状态的操作在内部都通过键名路径来进行，使用键名路径有几个好处:
- 作为状态的唯一标识
- 知道目标状态位于状态树中的位置，可供路由使用
- 可记录与传递状态改变的动作

这些好处对于过滤器来说很重要，当状态改变时，在过滤器中能通过键名路径明确知道是哪个状态被改变，以此进行相应的处理。

```js
    //使用键名路径来赋值取值：
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



### 异步的状态
```js
的撒发生地方
```

<p align="center">
  <img  src ="https://github.com/nullice/Gob/raw/master/logo/logo-200.png" />
</p>



# Gob
Simple and Intuitive State Management Base Filter.


这是一个基于过滤器的简单而直观的状态管理工具。
它有一个简单的流程实现对状态的管理：
```
  [改变动作] -> 前过滤器 -> [状态] -> 终过滤器
```

```js
    var Gob = new GOB()
    
    //创建状态
    Gob.$newStates({
        text: {fontSize: 14}
    })
    
    Gob.text.fontSize = 24; //普通赋值
    
    
    // 添加一个进行异步处理的过滤器
    Gob.$addFilter("pre", "aAsyncFilter",
         async function (oldValue, newValue, keys, who)
         {
             return await someAsyncProces(newValue)
         } ,
         ["text"])
         
   await Gob.$setValue(["text", "fontSize"], 32)／／异步赋值（根据键名路径）
    
    
```



## 特性

### 键名路径 keyPath
键名路径就是用来确定属性在对象中位置的数组或字符串： `"text.fontSize"`, `["text","fontSize"]`，Gob 中改变状态与获取状态都可以根据键名路径来进行，使用键名路径有几个好处:
- 作为状态的唯一标识
- 知道目标状态位于状态树中的位置
- 便于传递与修改
这对于过滤器来说很重要，当状态改变时，过滤器中能通过键名路径明确知道是哪个状态被改变，以此进行相应的处理。

```js
    Gob.$setValue(["text", "fontSize"], 32)
    //相当于（在没有异步过滤器的情况下）：
    Gob.text.fontSize = 32
```



### 异步的状态
```js
的撒发生地方
```

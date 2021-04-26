// 单例模式
function Singleton (name){
  this.name = name
}

Singleton.instance = null
Singleton.prototype.getName = function(){
  console.log(this.name);
}

Singleton.getInstance = function(name){
  if(!this.instance){
    this.instance = new this(name)
  }
  return this.instance
}

var a = Singleton.getInstance('aaa')
var b = Singleton.getInstance('bbb')
console.log(a === b); //true

// 


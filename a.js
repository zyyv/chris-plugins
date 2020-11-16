let aa = [111,222,333]
function reserve(...args,last){
  return [last,...args]
}
let bb = reserve(...aa)
console.log(bb)
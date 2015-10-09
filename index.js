/*
  Phoenix is a hash that survives hot reloading
  We fallback to it being an empty object if this is a normal situation
  If we are not hot reloading we store in local storage 
*/

var phoenix = require('./phoenix')(module,{
  dispose: function(){
    phoenix.streams.forEach(function(stream){
      stream.last()
    })
    delete phoenix.streams
  }
})

var Rx = require('rx/dist/rx.all.min.js')
var keynames = require('keynames')

if( !phoenix.canvas ){
  phoenix.canvas = document.createElement('canvas')
  document.body.appendChild( phoenix.canvas )
}

let canvas = phoenix.canvas
let context = canvas.getContext('2d')
   
    canvas.width = 400
    canvas.height = 200
    canvas.style.backgroundColor = '#FFF000'

console.log(JSON.stringify(phoenix),null,2)
var state = phoenix.state = Object.assign(
  {
    x:0, 
    y:0
  }, 
  phoenix.state
 )

let update = (state) => (prop) => (value) => {
  state[prop] = value
  return value;
}

let updateState = update(state)

let render = (c) => {
  context.clearRect(0,0,canvas.width,canvas.height)
  context.fillRect(c.x,c.y,20,20)
}


let add = (a,b) => a + b

let keyup = Rx.Observable.fromEvent(document.body,'keydown')

let eventToPolarity = (decrement, increment) => (e) => 
  keynames.is(decrement,e) ? -1 : keynames.is(increment,e) ? 10 : 0 

var x = keyup
  .map(eventToPolarity("LEFT","RIGHT"))
  .startWith(state.x)
  .scan(add)
  .map(updateState('x'))
  
var y = keyup
  .map(eventToPolarity("UP","DOWN"))
  .startWith(state.y)
  .scan(add)
  .map(updateState('y'))
  

var coords = x.combineLatest(y, (x,y) => ({x,y}) )
phoenix.streams = [ keyup,x,y,coords ]

coords.subscribe(function(coords){
  render(coords)
})
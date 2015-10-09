/*
  Phoenix is a hash that survives hot reloading
  We fallback to it being an empty object if this is a normal situation
  If we are not hot reloading we store in local storage 
*/

var phoenix = require('./phoenix')(module, {
  
  //phoenix will handle copying over the current phoenix data to the new phoenix
  //but you can put some logic 
  beforeCopy: function(){
    console.log('beforeCopy')
    phoenix.streams.forEach(function(stream){
      //kill streams or subscriptions
      stream.last && stream.last() || stream.dispose && stream.dispose()
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
  
var interval = Rx.Observable.interval(1000, Rx.Scheduler.requestAnimationFrame)
  .timestamp()
  .bufferWithCount(2, 1)
  .map(w => w[1].timestamp - w[0].timestamp)
  .subscribe(function(dt){
      console.log(dt)
  })
  
var coords = x.combineLatest(y, (x,y) => ({x,y}) ).subscribe(render)

phoenix.streams = [ keyup,x,y,coords,interval ]
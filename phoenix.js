module.exports = function(module,options){
  var disposeCB = options.dispose
  if(module.hot){
    module.hot.data = module.hot.data || {} 
    module.hot.accept(function(){})
    
    module.hot.dispose(function(nextHotData){
      try {
        disposeCB && disposeCB()
        Object.assign(nextHotData, module.hot.data)  
      } catch (e) {
        console.log(e)
      }
    }) 
    
    return module.hot.data
  }
}
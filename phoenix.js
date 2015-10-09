module.exports = function(module,options){
  var beforeCopy = options.beforeCopy
  if(module.hot){
    module.hot.data = module.hot.data || {} 
    module.hot.accept(function(){})
    
    module.hot.dispose(function(nextHotData){
      try {
        beforeCopy && beforeCopy()
        Object.assign(nextHotData, module.hot.data)  
      } catch (e) {
        console.error(e)
      }
    }) 
    
    return module.hot.data
  }
}
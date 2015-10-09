// module.exports = function(module){
//   console.log('phoenix.js')
//   var phoenix = {}
//   if(module.hot){
//     module.hot.accept()
//     module.hot.dispose(function(data){
//       Object.assign(data, phoenix)
//     })
//     phoenix = Object.assign({}, module.hot.data)
//   } else {
//     try {
//       phoenix = JSON.parse(localStorage.getItem('phoenix'))  
//     } catch (e) {
//       phoenix = {}
//     } finally {
//       setInterval(function(){
//         localStorage.setItem('phoenix',JSON.stringify(phoenix))
//       })
//     }
//   }
//   return phoenix; 
// }

module.exports = function(module, disposeCB){
  console.log('module.hot.data', JSON.stringify(module.hot.data,null,2))
  module.hot.data = module.hot.data || {}
  if(module.hot){
    module.hot.data = module.hot.data || {} 
    module.hot.accept()
    
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

//module.hot.accept()

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
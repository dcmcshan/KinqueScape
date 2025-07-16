// Unity Framework - Development Placeholder
// This provides basic Unity WebGL framework compatibility

(function() {
  console.log('Unity Framework loaded (development mode)');
  
  // Mock Unity framework functions
  window.unityFramework = {
    instantiate: function(config) {
      return Promise.resolve({
        SendMessage: function(gameObject, method, parameter) {
          console.log('Unity Framework SendMessage:', gameObject, method, parameter);
        }
      });
    }
  };
  
  // Unity module system mock
  if (!window.Module) {
    window.Module = {
      canvas: null,
      print: function(text) {
        console.log('Unity:', text);
      },
      printErr: function(text) {
        console.error('Unity:', text);
      }
    };
  }
})();
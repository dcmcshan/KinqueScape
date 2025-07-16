// Unity Framework - Development Implementation
// Compatible with react-unity-webgl

(function() {
  console.log('Unity Framework loaded (development mode)');
  
  // Unity module system
  if (!window.Module) {
    window.Module = {
      canvas: null,
      print: function(text) {
        console.log('Unity:', text);
      },
      printErr: function(text) {
        console.error('Unity:', text);
      },
      onRuntimeInitialized: function() {
        console.log('Unity runtime initialized');
      }
    };
  }
  
  // Mock WASM loading
  window.WebAssembly = window.WebAssembly || {
    instantiate: function() {
      return Promise.resolve({
        instance: {
          exports: {}
        }
      });
    }
  };
  
  console.log('Unity Framework ready');
})();
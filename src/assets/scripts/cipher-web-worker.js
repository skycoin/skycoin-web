var onmessage = function(e) {
  if (e) {
    try {
      switch(e.data.operation) {
        case 0: {
          try {
            var hasCrypto = crypto;
          } catch (e) {}

          if (hasCrypto) {
            importScripts(e.data.url + '/assets/scripts/main.js');
            break;
          } else {
            postMessage({result: 'No crypto', workID: 0});
            break;
          }
        }
        case 1: {
          postMessage({result: Cipher.GenerateAddresses(e.data.data), workID: e.data.workID});
          break;
        }
        case 2: {
          postMessage({result: Cipher.PrepareTransaction(e.data.data.inputs, e.data.data.outputs), workID: e.data.workID});
          break;
        }
        default: {
          postMessage({result: 0, workID: e.data.workID});
          break;
        }
      }
    } catch(err) {
      // The error message must be prefixed with "Error:" to be recognized as an error
      // message and not as a valid response. The prefix is defined in WebWorkersHelper.errPrefix.
      postMessage({result: "Error:" + err.message, workID: e.data.workID});
    }
  }
}

module.exports = {
  onmessage
};
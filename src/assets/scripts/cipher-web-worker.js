importScripts('main.js');

onmessage = function(e) {
  try {
    switch(e.data.operation) {
      case 0:
        postMessage({result: Cipher.GenerateAddresses(e.data.data), workID: e.data.workID});
      case 1:
        postMessage({result: Cipher.PrepareTransaction(e.data.data.inputs, e.data.data.outputs), workID: e.data.workID});
      default:
        postMessage({result: 0, workID: e.data.workID});
    }
  } catch(err) {
    // The error message must be prefixed with "Error:" to be recognized as an error
    // message and not as a valid response. The prefix is defined in WebWorkersHelper.errPrefix.
    postMessage({result: "Error:" + err.message, workID: e.data.workID});
  }
}

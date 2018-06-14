importScripts('main.js');

onmessage = function(e) {
  try {
    if (e.data.operation == 0) {
      postMessage({result: Cipher.GenerateAddresses(e.data.data), workID: e.data.workID});
    } else if (e.data.operation == 1) {
      postMessage({result: Cipher.PrepareTransaction(e.data.data.inputs, e.data.data.outputs), workID: e.data.workID});
    } else {
      postMessage({result: 0, workID: e.data.workID});
    }
  } catch(err) {
    // The error message must be prefixed with "Error:" to be recognized as an error
    // message and not as a valid response. The prefix is defined in WebWorkersHelper.errPrefix.
    postMessage({result: "Error:" + err.message, workID: e.data.workID});
  }
}

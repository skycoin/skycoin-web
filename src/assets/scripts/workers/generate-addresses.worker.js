importScripts('../main.js');

onmessage = function(e) {
  try {
    postMessage(Cipher.GenerateAddresses(e.data));
  } catch(err) {
    // The error message must be prefixed with "Error:" to be recognized as an error
    // message and not as a valid response. The prefix is defined in WebWorkersHelper.errPrefix.
    postMessage("Error:" + err.message);
  }
}
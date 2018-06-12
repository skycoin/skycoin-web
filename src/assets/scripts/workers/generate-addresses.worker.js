importScripts('../main.js');

onmessage = function(e) {
  try {
    let currentSeed = e.data.seed;

    e.data.addresses.forEach((address) => {
      const fullAddress = Cipher.GenerateAddresses(currentSeed);

      if (fullAddress.Address !== address.address) {
        postMessage('Error:service.wallet.wrong-seed');
      }

      address.next_seed = fullAddress.NextSeed;
      address.secret_key = fullAddress.Secret;
      address.public_key = fullAddress.Public;
      currentSeed = fullAddress.NextSeed;
    });

    postMessage(e.data.addresses);
  } catch(err) {
    // The error message must be prefixed with "Error:" to be recognized as an error
    // message and not as a valid response. The prefix is defined in WebWorkersHelper.errPrefix.
    postMessage("Error:" + err.message);
  }
}

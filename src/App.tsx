import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection, PublicKey, Message } from '@solana/web3.js';
import bs58 from 'bs58';
import nacl from 'tweetnacl';

function App() {
  const [count, setCount] = useState(0);

  const toBuffer = (arr: Buffer | Uint8Array | Array<number>): Buffer => {
  if (Buffer.isBuffer(arr)) {
    return arr;
  } else if (arr instanceof Uint8Array) {
    return Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength);
  } else {
    return Buffer.from(arr);
  }
};

  const getProvider = () => {
    if ('phantom' in window) {
      //@ts-ignore
      const provider = window.phantom?.solana;

      if (provider?.isPhantom) {
        return provider;
      }
    }

    window.open('https://phantom.app/', '_blank');
  };

  return (
    <div className="App">
      <div className="card">
        <button
          onClick={async () => {
            const provider = getProvider(); // see "Detecting the Provider"
            try {
              console.log('provider', provider);
              const resp = provider.connect();
              console.log(resp.publicKey.toString());
              // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
            } catch (err) {
              console.log('User rejected the request.');
            }
          }}
        >
          Connect
        </button>
      </div>
      <div className="card">
        <button
          onClick={async () => {
            const provider = getProvider(); // see "Detecting the Provider"
            const resp = await provider.connect();
            // const resp = await provider.request({ method: 'connect' });
            console.log('connect testing ', resp);
            const prvDecode = new Uint8Array([42, 71, 43, 13, 67, 128, 203, 52, 224, 205, 157, 169, 247, 215, 97, 186, 215, 215, 14, 155, 77, 64, 164, 205, 160, 59, 49, 102, 28, 231, 43, 142, 92, 177, 72, 65, 66, 1, 104, 56, 20, 167, 81, 135, 5, 234, 207, 129, 173, 158, 157, 249, 22, 129, 34, 167, 85, 172, 200, 118, 36, 50, 116, 193]);
            const keypair = Keypair.fromSecretKey(prvDecode);
            const pubKey = new PublicKey('8SXLP6NLixTDz3DssBXbU3sw8rHHVmmfDLxHCZwH6zhZ');
            const network = 'https://api.mainnet-beta.solana.com';
            const connection = new Connection(network);
            const recentBlockHash = await connection.getLatestBlockhash();
            const transaction = new Transaction();
            console.log('transaction.recentBlockhash ', pubKey);
            const txn = transaction.add(
              SystemProgram.transfer({
                fromPubkey: pubKey,
                toPubkey: pubKey,
                lamports: LAMPORTS_PER_SOL * 0.01,
              })
            );
            console.log('transaction.recentBlockhash ', recentBlockHash.blockhash);
            txn.recentBlockhash = recentBlockHash.blockhash;
            txn.feePayer = pubKey;
            console.log('encoded txn ', txn);
            const serialisedMessage = txn.serializeMessage();
            console.log('encoded serial ', bs58.encode(serialisedMessage));

            const signature = await provider.request({
              method: 'signAndSendTransaction',
              params: [
                {
                  to: '8SXLP6NLixTDz3DssBXbU3sw8rHHVmmfDLxHCZwH6zhZ',
                  from: '8SXLP6NLixTDz3DssBXbU3sw8rHHVmmfDLxHCZwH6zhZ',
                  value: 0.01,
                  message: bs58.encode(serialisedMessage),
                },
              ],
            });




            // console.log('transaction.serializeMessage ', txn.serializeMessage());
            // const encoded = bs58.encode(serialisedMessage);
            // console.log('encoded value', encoded);
            // const decoded = bs58.decode(encoded);
            // console.log('decoded value ', decoded);
            // const msg = Message.from(decoded);
            // console.log('decoded msg ', msg);
            // const txdeserialised = Transaction.populate(msg);

            // console.log('decoded txdeserialised ', txdeserialised);
            // txdeserialised.sign(keypair);
          
            // // return txdeserialised;
            // const finalWireTransaction = txdeserialised.serialize();
            // const signature = await connection.sendRawTransaction(finalWireTransaction);
            // console.log('signature', signature);
          }}
        >
          Send Transaction
        </button>
      </div>
      <div className="card">
        <button
          onClick={async () => {
            const provider = getProvider(); // see "Detecting the Provider"
            const message = `To avoid digital dognappers, sign below to authenticate with CryptoCorgis`;
            const encodedMessage = new TextEncoder().encode(message);
            console.log('encodedMessage', encodedMessage);
            const prvDecode = new Uint8Array([42, 71, 43, 13, 67, 128, 203, 52, 224, 205, 157, 169, 247, 215, 97, 186, 215, 215, 14, 155, 77, 64, 164, 205, 160, 59, 49, 102, 28, 231, 43, 142, 92, 177, 72, 65, 66, 1, 104, 56, 20, 167, 81, 135, 5, 234, 207, 129, 173, 158, 157, 249, 22, 129, 34, 167, 85, 172, 200, 118, 36, 50, 116, 193]);
            const keypair = Keypair.fromSecretKey(prvDecode);
            // const msg = Message.from(encodedMessage);
            
            const trans = new Transaction()
            const network = 'https://api.mainnet-beta.solana.com';
            const connection = new Connection(network);
            const recentBlockHash = await connection.getLatestBlockhash();
            trans.recentBlockhash = recentBlockHash.blockhash;
            trans.feePayer = keypair.publicKey;
            // trans.sign(keypair);
            const signature = nacl.sign.detached(encodedMessage, keypair.secretKey);
            console.log('trans.signature', signature);
            trans.addSignature(keypair.publicKey, toBuffer(signature));
            console.log('trans.signature from transaction ', trans.signature);
            console.log('signedMessage', bs58.encode(signature));
            console.log('bs58 from transaction ',  bs58.encode(trans.signature ?? new Uint8Array()));
            const signedMessage = nacl.sign(encodedMessage, keypair.secretKey);
            console.log('signedMessage to string ', signedMessage.toString());
            console.log('signedMessage', bs58.encode(signedMessage));
            console.log('decoded message ', bs58.decode('DpAiF83QCh53k7L8mUGfGCrUHyQTykz8ASNJiNiREx3gBCXy6C9ptM5WxkbuofRkuKABYc48oZJbZqvyaMvyCxp'));
            console.log('decoded message ', new TextDecoder().decode(bs58.decode('DpAiF83QCh53k7L8mUGfGCrUHyQTykz8ASNJiNiREx3gBCXy6C9ptM5WxkbuofRkuKABYc48oZJbZqvyaMvyCxp')));

            const signedMessageWallet = await provider.request({
              method: 'signMessage',
              params: {
                message: encodedMessage,
                display: 'hex',
              },
            });
            console.log('signedMessageWallet', signedMessageWallet);
          }}
        >
          Sign Message
        </button>
      </div>
    </div>
  );
}

export default App;

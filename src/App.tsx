import { useState } from 'react';
import reactLogo from './assets/react.svg';
import './App.css';
import { Keypair, Transaction, SystemProgram, LAMPORTS_PER_SOL, Connection, PublicKey, Message } from '@solana/web3.js';
import bs58 from 'bs58';

function App() {
  const [count, setCount] = useState(0);
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
            const prvDecode = new Uint8Array([42, 71, 43]);
            const keypair = Keypair.fromSecretKey(prvDecode);
            const pubKey = new PublicKey('7EqJFpwpZkYXNtGFZn5rqF6CD9DJDRSBANXpnHR5Pe2c');
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
            console.log('transaction.serializeMessage ', txn.serializeMessage());
            const encoded = bs58.encode(serialisedMessage);
            console.log('encoded value', encoded);
            const decoded = bs58.decode(encoded);
            console.log('decoded value ', decoded);
            const msg = Message.from(decoded);
            console.log('decoded msg ', msg);
            const txdeserialised = Transaction.populate(msg);

            console.log('decoded txdeserialised ', txdeserialised);
            txdeserialised.sign(keypair);
          
            return txdeserialised;
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
            try {
              const message = `To avoid digital dognappers, sign below to authenticate with CryptoCorgis`;
              const encodedMessage = new TextEncoder().encode(message);
              console.log('encodedMessage', encodedMessage);
              const signedMessage = await provider.request({
                method: 'signMessage',
                params: {
                  message: encodedMessage,
                  display: 'hex',
                },
              });
              console.log('signedMessage', signedMessage);
              // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo
            } catch (err) {
              console.log('User rejected the request.');
            }
          }}
        >
          Sign Message
        </button>
      </div>
    </div>
  );
}

export default App;

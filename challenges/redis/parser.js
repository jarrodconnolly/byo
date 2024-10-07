const CMD_ARRAY = '*'.charCodeAt(0);
const CMD_BULK_STRING = '$'.charCodeAt(0);

class RedisParser {
  constructor(socket, dataStore) {
    this.position = 0;
    this.serverSocket = socket;
    this.dataStore = dataStore;
  }

  processCommands(data) {
    this.position = 0;
  
    while (this.position < data.length) {
      if (data[this.position] === CMD_ARRAY) {
        this.position++; // Skip the *
        this.processArray(data);
      } else {
        this.processInline(data);
      }
    }
  }

  readNumber(data) {
    let number = 0;
    let isNegative = false;
    if (data[this.position] === 45) {
      isNegative = true;
      this.position++;
    }
  
    while (data[this.position] !== 13) {
      number = number * 10 + (data[this.position] - 48);
      this.position++;
    }
  
    if (isNegative) {
      number = -number;
    }
  
    this.position += 2; // Skip the CRLF
    return number;
  }

  readCRLF(data) {
    const cr = data[this.position];
    this.position++;
    const lf = data[this.position];
    this.position++;
    return cr === 13 && lf === 10;
  }
  
  readBulkString(data) {
    this.position++; // Skip the $
    const messageLength = this.readNumber(data);
    const message = data.toString('ascii', this.position, this.position + messageLength);
    this.position += messageLength + 2; // Skip the message and the CRLF
    return message;
  }
  
  processPing(data) {
    this.serverSocket.write('+PONG\r\n');
  }
  
  sendSimpleString(message) {
    this.serverSocket.write(`+${message}\r\n`);
  }
  
  sendBulkString(message) {
    this.serverSocket.write(`$${message.length}\r\n${message}\r\n`);
  }
  buildBulkString(message) {
    return `$${message.length}\r\n${message}\r\n`;
  }
  
  sendError(message) {
    this.serverSocket.write(`-ERR ${message}\r\n`);
  }
  
  processConfig(data) {
    const subCommand = this.readBulkString(data);
    if (subCommand === 'GET') {
      const key = this.readBulkString(data);
      if (key === 'save') {
        let response = '*2\r\n';
        response += this.buildBulkString('save');
        response += this.buildBulkString('3600 1 300 100 60 10000');
        this.serverSocket.write(response);
      } else if (key === 'appendonly') {
        let response = '*2\r\n';
        response += this.buildBulkString('appendonly');
        response += this.buildBulkString('no');
        this.serverSocket.write(response);
      }
    }
  }
  
  processHello(data) {
    const version = this.readNumber(data);
    sendError('unknown command \'HELLO\''); // error to force client to use RESP2 
  }
  
  processInline(data) {
    const message = data.toString('ascii', this.position, data.indexOf('\r\n', this.position));
    this.position += message.length + 2; // Skip the message and the CRLF
  
    if (message === 'PING') {
      this.processPing(data);
    } else {
      this.sendError('unknown command');
    }
  }
  processArray(data) {
    const messageCount = this.readNumber(data);
    //console.log(`Array Count: ${messageCount}`);
  
    if (data[this.position] === CMD_BULK_STRING) {
      const command = this.readBulkString(data);
      if (command === 'PING') {
        this.processPing(data);
      } else if(command === 'SET') {
        const key = this.readBulkString(data);
        const value = this.readBulkString(data);
        this.dataStore.set(key, value);
        this.sendSimpleString('OK');
      } else if(command === 'GET') {
        const key = this.readBulkString(data);
        const value = this.dataStore.get(key);
        if (value) {
          this.sendBulkString(value);
        } else {
          this.sendSimpleString('(nil)');
        }
      } else if (command === 'CONFIG') {
        this.processConfig(data);
      } else if (command === 'ECHO') {
        const message = this.readBulkString(data);
        this.sendSimpleString(message);
      } else if(command === 'HELLO') {
        this.processHello(data);
      } else {
        this.sendError('unknown command');
      }
    }
  }
}

export { RedisParser };

import electron from 'electron';
import path from 'path';
import fs from 'fs';

export default class Store {
  public path: string;
  public data: any;
  constructor(opts: any) {
    const userDataPath = electron.app.getPath('userData');

    this.path = path.join(userDataPath, opts.configName + '.json');
    this.data = parseDataFile(this.path, opts.defaults);
  }
  get(key: any) {
    return this.data[key];
  }
  set(key: any, val: any) {
    this.data[key] = val;
    fs.writeFileSync(this.path, JSON.stringify(this.data));
  }
}

function parseDataFile(filePath: any, defaults: any) {
  try {
    return JSON.parse(fs.readFileSync(filePath).toString());
  } catch (error) {
    return defaults;
  }
}

module.exports = Store;

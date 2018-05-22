import chalk from 'chalk';
import { spawn } from 'child_process';
import _ from 'lodash';
import moment from 'moment';

class Logger {
  constructor() {
    const listToExecute = [
      {
        label: '<LABEL>',
        path: '<PATH>',
        command: '<Command with args>',
        color: '#00A896'
      }
    ];

    _.forEach(listToExecute, item => {
      this.exec(item);
    });
  }
  exec(settings) {
    const command = settings.command.split(' ')[0];
    const args = settings.command.split(' ');
    args.shift();

    const ps = spawn(command, args, {
      cwd: settings.path
    });

    ps.stdout.on('data', data => {
      this.log(data, settings.label, settings.color);
    });
    ps.stderr.on('data', data => {
      console.log('\x07');
      this.log(data, settings.label, '#E94F37');
    });
    ps.on('close', data => {
      this.log(data, settings.label, settings.color);
    });
  }
  log(data, label, color) {
    if (!_.isNil(data) && _.size(data) > 0) {
      const message = chalk.hex(color)(data.toString());
      const labelColored = chalk.hex('#F0F3BD')(label);
      console.log(`${this.getTime()} :: [${labelColored}] :: ${message}`);
    }
  }
  getTime() {
    const m = moment(new Date());
    return chalk.hex('#F24333')(`[${m.format('YYYY-MM-DD HH:mm:ss')}]`);
  }
}

new Logger();

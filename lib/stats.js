// Copyright 2016 Zaiste & contributors. All rights reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

const Promise = require('bluebird');

const redis = require('./redis').getClient();
const Job = require('./job');

class Stats {
  static get active() {
    return redis.llenAsync('blezer:active');
  }

  static get enqueued() {
    const size = _ => redis.llenAsync(_);
    const sum = (acc, _) => acc + _;

    return redis.keysAsync('blezer:queues:*').map(size).reduce(sum, 0);
  }

  static get failed() {
    return Job.failed().then(failed => failed.length);
  }

  static get processed() {
    return redis.llenAsync('blezer:processed');
  }

  static async queues() {
    const names = await redis.smembersAsync('blezer:queues');

    async function lengths(h, name) {
      const length = await redis.llenAsync(`blezer:queues:${name}`);
      h[name] = length;
      return h;
    }
    const queues = await Promise.reduce(names, lengths, {});

    return queues;
  }
}

module.exports = Stats;

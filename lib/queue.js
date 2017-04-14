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
const EventEmitter = require('events').EventEmitter;

const redis = require('./redis');
const Job = require('./job');

class Queue extends EventEmitter {
  constructor(name = 'default') {
    super();

    Object.assign(this, { name });

    redis.saddAsync('blezer:queues', this.name);
    // .then emit `ready`
  }

  async enqueue(task, args = [], options = {}) {
    let job = new Job(this.path, task, args, options);
    await redis.lpushAsync(this.path, job.jid);

    return job;
  }

  get path() {
    return `blezer:queues:${this.name}`;
  }

  get jobs() {
    return redis.lrangeAsync(this.path, 0, -1);
  }

  get size() {
    return redis.llenAsync(this.path);
  }

  static get all() {
    return redis.smembersAsync('blezer:queues');
  }
}

module.exports = Queue;

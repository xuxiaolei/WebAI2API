/**
 * @fileoverview 轻量异步互斥锁
 * @description 保证同一时刻只有一个 async 任务持有锁，用于防止同一浏览器实例的多个 Worker 并发操作鼠标。
 */

export class AsyncMutex {
    constructor() {
        this._queue = [];
        this._locked = false;
    }

    /**
     * 获取锁，返回释放函数
     * @returns {Promise<() => void>}
     */
    acquire() {
        return new Promise(resolve => {
            const tryAcquire = () => {
                if (!this._locked) {
                    this._locked = true;
                    resolve(() => {
                        this._locked = false;
                        if (this._queue.length > 0) {
                            this._queue.shift()();
                        }
                    });
                } else {
                    this._queue.push(tryAcquire);
                }
            };
            tryAcquire();
        });
    }
}

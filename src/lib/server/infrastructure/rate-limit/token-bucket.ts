import { time } from "$lib/server/utils/general/time";

interface Bucket {
	count: number;
	refilledAt: number;
}

export class TokenBucket<_Key> {
    public max: number
    public refillIntervalSeconds: number

    constructor (max: number, refillIntervalSeconds: number) {
        this.max = max
        this.refillIntervalSeconds = refillIntervalSeconds
    }

    private storage = new Map<_Key, Bucket>()

	public check(key: _Key, cost: number): boolean {
		const bucket = this.storage.get(key) ?? null;
		if (bucket === null) {
			return true;
		}

		const refill = Math.floor((time.now() - bucket.refilledAt) / (this.refillIntervalSeconds * 1000));
		if (refill > 0) {
			bucket.count = Math.min(bucket.count + refill, this.max)
			bucket.refilledAt += refill * this.refillIntervalSeconds * 1000
		}

		return bucket.count >= cost; 
	}

	public consume(key: _Key, cost: number): boolean {
		let bucket = this.storage.get(key) ?? null;

		if (bucket === null) {
			bucket = {
				count: this.max - cost,
				refilledAt: time.now()
			};
			this.storage.set(key, bucket);
			return true;
		}

		const refill = Math.floor((time.now() - bucket.refilledAt) / (this.refillIntervalSeconds * 1000));

		if (refill > 0) {
			bucket.count = Math.min(bucket.count + refill, this.max);
			bucket.refilledAt += refill* this.refillIntervalSeconds * 1000
		}

		if (bucket.count < cost) {
			this.storage.set(key, bucket);
			return false;
		}

		bucket.count -= cost;
		this.storage.set(key, bucket);
		return true;
	}
}
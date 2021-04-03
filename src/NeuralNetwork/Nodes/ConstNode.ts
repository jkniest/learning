import NetworkNode from "./NetworkNode";

export default class ConstNode extends NetworkNode {
    public value: number;

    public setValue(value: number): void {
        this.value = value;
    }

    public calculate(): number {
        return this.value;
    }

    public serialize(): object {
        return {
            type: 'const',
            weights: this.weights
        };
    }

    public deserialize(json: any): void {
        this.weights = json.weights;
    }

    public mutate(chance: number, rate: number): void {
        this.weights = this.weights.map(weight => {
            if (Math.random() * 100 > chance) {
                return weight;
            }

            return weight + Math.random() * (rate * 2 + 1) - rate;
        });
    }
}
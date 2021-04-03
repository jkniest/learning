import NetworkNode from "./NetworkNode";

export default class SigmoidNode extends NetworkNode {
    public bias: number;

    constructor(index: number, bias?: number) {
        super(index);

        this.bias = bias ?? Math.random();
    }

    public calculate(): number {
        const nodes = this.layer.network.layers[this.layer.index - 1].nodes;
        let result = 0;

        for (let node of nodes) {
            result += node.calculate() * node.getWeight(this.index);
        }

        return 1 / (1 + Math.pow(Math.E, -(result + this.bias)));
    }

    public serialize(): object {
        return {
            type: 'sigmoid',
            weights: this.weights,
            bias: this.bias
        };
    }

    public deserialize(json: any): void {
        this.weights = json.weights;
        this.bias = json.bias;
    }

    public mutate(chance: number, rate: number): void {
        this.weights = this.weights.map(weight => {
            if (Math.random() * 100 > chance) {
                return weight;
            }

            return weight + Math.random() * (rate * 2 + 1) - rate;
        });

        if (Math.random() * 100 < chance) {
            this.bias += Math.random() * (rate * 2 + 1) - rate;
        }
    }
}
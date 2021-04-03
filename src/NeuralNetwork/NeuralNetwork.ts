import NetworkLayer from "./NetworkLayer";
import ConstNode from "./Nodes/ConstNode";
import SigmoidNode from "./Nodes/SigmoidNode";

export default class NeuralNetwork {
    public layers: NetworkLayer[] = [];

    constructor(
        inputNodeCount: number,
        hiddenNodeCounts: number[],
        outputNodeCount: number
    ) {
        const inputNodes = [];
        for (let i = 0; i < inputNodeCount; i++) {
            inputNodes.push(new ConstNode(i));
        }
        this.layers.push(new NetworkLayer(0, this, inputNodes));

        for (let i = 0; i < hiddenNodeCounts.length; i++) {
            const hiddenNodes = [];
            for (let j = 0; j < hiddenNodeCounts[i]; j++) {
                hiddenNodes.push(new SigmoidNode(j));
            }
            this.layers.push(new NetworkLayer(i+1, this, hiddenNodes));
        }

        const outputNodes = [];
        for (let i = 0; i < outputNodeCount; i++) {
            outputNodes.push(new SigmoidNode(i));
        }
        this.layers.push(new NetworkLayer(this.layers.length, this, outputNodes));

        this.createWeights();
    }

    public static fromSerialized(serialized: string): NeuralNetwork {
        const json = JSON.parse(serialized);

        const network = new NeuralNetwork(
            json.layers[0].nodes.length,
            json.layers.slice(1, json.layers.length - 1).map(layer => layer.nodes.length),
            json.layers[json.layers.length - 1].nodes.length
        );

        for(let i = 0; i < network.layers.length; i++) {
            network.layers[i].deserialize(json.layers[i]);
        }

        return network;
    }

    private createWeights(): void {
        for (let i = 0; i < this.layers.length; i++) {
            this.layers[i].initializeRandomNodes();
        }
    }

    public calculate(inputs: number[]): number {
        const inputNodes = this.layers[0].nodes as ConstNode[];
        for(let i = 0; i < inputNodes.length; i++) {
            inputNodes[i].setValue(inputs[i]);
        }

        const results = this.layers[this.layers.length - 1].calculate();

        let highestIndex = 0;
        let highestValue = Number.MIN_VALUE;

        for (let i = 0; i < results.length; i++) {
            if (results[i] < highestValue) {
                continue;
            }

            highestIndex = i;
            highestValue = results[i];
        }

        return highestIndex;
    }

    public serialize(): string {
        const serialized = {
            layers: this.layers.map(layer => ({
                nodes: layer.nodes.map(node => node.serialize())
            }))
        };

        return JSON.stringify(serialized);
    }

    public mutate(chance: number, rate: number): NeuralNetwork {
        this.layers.forEach(layer => layer.mutate(chance, rate));

        return this;
    }
}
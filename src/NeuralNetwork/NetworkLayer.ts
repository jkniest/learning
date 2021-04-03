import NetworkNode from "./Nodes/NetworkNode";
import NeuralNetwork from "./NeuralNetwork";

export default class NetworkLayer {
    public index: number;
    public network: NeuralNetwork;
    public nodes: NetworkNode[];

    constructor(index: number, network: NeuralNetwork, nodes: NetworkNode[]) {
        this.index = index;
        this.network = network;
        this.nodes = nodes;
    }

    public initializeRandomNodes(): void {
        this.nodes.forEach(node => node.initRandomWeightsForNextLayer(this));
    }

    public calculate(): number[] {
        return this.nodes.map(node => node.calculate());
    }

    public deserialize(json: any): void {
        for (let i = 0; i < this.nodes.length; i++) {
            this.nodes[i].deserialize(json.nodes[i]);
        }
    }

    public mutate(chance: number, rate: number): void {
        this.nodes.forEach(node => node.mutate(chance, rate));
    }
}
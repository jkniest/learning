import NetworkLayer from "../NetworkLayer";

export default abstract class NetworkNode {
    protected index: number;
    protected weights: number[] = [];
    protected layer: NetworkLayer;

    public constructor(index: number) {
        this.index = index;
    }

    public abstract calculate(): number;

    public initRandomWeightsForNextLayer(layer: NetworkLayer): void {
        this.layer = layer;

        const nextLayer = layer.network.layers[layer.index + 1] ?? null;
        if (!nextLayer) {
            return;
        }

        for(let i = 0; i < nextLayer.nodes.length; i++) {
            this.weights.push(Math.random());
        }
    }

    public getWeight(index: number): number {
        return this.weights[index];
    }

    public abstract serialize(): object;

    public abstract deserialize(json: any): void;

    public abstract mutate(chance: number, rate: number): void;
}
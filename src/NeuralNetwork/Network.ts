import NetworkInterface from "./NetworkInterface";

export default class Network {
    private readonly inputNodes: number;
    private readonly hiddenNodes: number;
    private readonly outputNodes: number;

    private weightsHidden: number[] = [];
    private weightsOutput: number[] = [];
    private biases: number[] = [];

    private nInterface?: NetworkInterface;

    constructor(inputNodes: number, hiddenNodes: number, outputNodes: number, canvas?: HTMLCanvasElement) {
        this.inputNodes = inputNodes;
        this.hiddenNodes = hiddenNodes;
        this.outputNodes = outputNodes;

        for (let i = 0; i < inputNodes * hiddenNodes; i++) {
            this.weightsHidden[i] = Math.random();
        }

        for (let i = 0; i < hiddenNodes * outputNodes; i++) {
            this.weightsOutput[i] = Math.random();
        }

        for (let i = 0; i < hiddenNodes + outputNodes; i++) {
            this.biases[i] = Math.random();
        }

        if (canvas) {
            this.nInterface = new NetworkInterface(this, canvas);
        }
    }

    public static fromSerialized(serialized: string, canvas?: HTMLCanvasElement): Network {
        const data = JSON.parse(serialized);

        const network = new Network(data.inputNodes, data.hiddenNodes, data.outputNodes, canvas);
        network.weightsHidden = data.weightsHidden;
        network.weightsOutput = data.weightsOutput;
        network.biases = data.biases;

        return network;
    }

    public calculate(inputs: number[]): number {
        let highestIndex = 0;
        let highestValue = Number.MIN_VALUE;

        for (let output = 0; output < this.outputNodes; output++) {
            const value = this.calculateOutput(output, inputs);
            if (value > highestValue) {
                highestIndex = output;
                highestValue = value;
            }
        }

        this.nInterface?.updateInputs(inputs);
        this.nInterface?.updateOutput(highestIndex);

        return highestIndex;
    }

    private calculateOutput(index: number, inputs: number[]): number {
        let result = 0;

        for (let hidden = 0; hidden < this.hiddenNodes; hidden++) {
            result += this.calculateHidden(hidden, inputs) * this.weightsOutput[index * this.hiddenNodes + hidden];
        }

        return this.sigmoid(result + this.biases[this.hiddenNodes + index]);
    }

    private calculateHidden(index: number, inputs: number[]): number {
        let result = 0;

        for (let input = 0; input < this.inputNodes; input++) {
            result += inputs[input] * this.weightsHidden[index * this.inputNodes + input];
        }

        return this.sigmoid(result + this.biases[index]);
    }

    public draw(): void {
        this.nInterface?.draw();
    }

    public getInputNodes(): number {
        return this.inputNodes;
    }

    public getHiddenNodes(): number {
        return this.hiddenNodes;
    }

    public getOutputNodes(): number {
        return this.outputNodes;
    }

    public getWeights(): number[] {
        return this.weightsOutput;
    }

    private sigmoid(x: number): number {
        return 1 / (1 + Math.pow(Math.E, -x));
    }

    public serialize(): string {
        return JSON.stringify({
            inputNodes: this.inputNodes,
            hiddenNodes: this.hiddenNodes,
            outputNodes: this.outputNodes,
            weightsHidden: this.weightsHidden,
            weightsOutput: this.weightsOutput,
            biases: this.biases
        });
    }
}
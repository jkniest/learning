import NetworkInterface from "./NetworkInterface";

export default class Network
{
    private inputNodes: number;
    private outputNodes: number;
    private weights: number[] = [];
    private nInterface?: NetworkInterface;

    constructor(inputNodes: number, outputNodes: number, render: boolean) {
        this.inputNodes = inputNodes;
        this.outputNodes = outputNodes;

        for(let i = 0; i < inputNodes*outputNodes; i++) {
            this.weights[i] = Math.random();
        }

        if (render) {
            this.nInterface = new NetworkInterface(this);
        }
    }

    public calculate(inputs: number[]): number
    {
        let highestIndex = 0;
        let highestValue = Number.MIN_VALUE;

        for(let output = 0; output < this.outputNodes; output++) {
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

    private calculateOutput(index: number, inputs: number[]): number
    {
        let result = 0;

        for(let input = 0; input < this.inputNodes; input++) {
            result += inputs[input] * this.weights[index * this.inputNodes + input];
        }

        return result;
    }

    public draw(): void {
        this.nInterface?.draw();
    }

    public getInputNodes(): number {
        return this.inputNodes;
    }

    public getOutputNodes(): number {
        return this.outputNodes;
    }

    public getWeights(): number[] {
        return this.weights;
    }
}
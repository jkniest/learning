import Network from "./Network";

export default class NetworkInterface {
    private network: Network;
    private ctx: CanvasRenderingContext2D;
    private activeOutput: number = 0;
    private inputs: number[] = [];

    private readonly ACTIONS: string[] = [
        'Move right',
        'Move left',
        'Move up',
        'Move down',
        'Rotate right',
        'Rotate left',
        'Shoot'
    ];

    constructor(network: Network) {
        this.network = network;

        const canvas = document.getElementById('network') as HTMLCanvasElement;
        this.ctx = canvas.getContext('2d');
    }

    public updateInputs(inputs: number[]) {
        this.inputs = inputs;
    }

    public updateOutput(output: number) {
        this.activeOutput = output;
    }

    public draw(): void {
        this.ctx.clearRect(0, 0, 600, 400);

        const paddingX = 100;
        const paddingY = 20;

        const height = 400 - (paddingY * 2);

        const inputNodes = this.network.getInputNodes();
        const outputNodes = this.network.getOutputNodes();

        this.renderInput(height, inputNodes, paddingX, paddingY);
        this.renderOutput(height, outputNodes, paddingX, paddingY);
        this.renderWeights(height, inputNodes, outputNodes, paddingX, paddingY);
        this.renderOutputLabels(height, paddingY, outputNodes, paddingX);
        this.renderInputLabels(height, paddingY, inputNodes, paddingX);
    }

    private renderInput(height: number, inputNodes: number, paddingX: number, paddingY: number) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';

        const cellHeightInput = (height + paddingY) / inputNodes;
        for (let i = 0; i < inputNodes; i++) {
            this.ctx.arc(15 + paddingX, paddingY + cellHeightInput * i + 15, 15, 0, Math.PI * 2)
        }

        this.ctx.fill();
    }

    private renderOutput(height: number, outputNodes: number, paddingX: number, paddingY: number) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'blue';

        const cellHeightOutput = (height + paddingY) / outputNodes;
        for (let i = 0; i < outputNodes; i++) {
            this.ctx.arc(600 - paddingX - 15, paddingY + cellHeightOutput * i + 15, 15, 0, Math.PI * 2);
        }
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = 'green';
        this.ctx.arc(600 - paddingX - 15, paddingY + cellHeightOutput * this.activeOutput + 15, 15, 0, Math.PI * 2);
        this.ctx.fill();
    }

    private renderWeights(height: number, inputNodes: number, outputNodes: number, paddingX: number, paddingY: number) {
        const cellHeightInput = (height + paddingY) / inputNodes;
        const cellHeightOutput = (height + paddingY) / outputNodes;

        for (let i = 0; i < inputNodes; i++) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 1;
            this.ctx.moveTo(paddingX + 15, paddingY + cellHeightInput * i + 15);
            this.ctx.lineTo(600 - paddingX - 15, paddingY + cellHeightOutput * this.activeOutput + 15);
            this.ctx.stroke();
        }
    }

    private renderOutputLabels(height: number, paddingY: number, outputNodes: number, paddingX: number) {
        this.ctx.font = '14px Arial';
        const cellHeightOutput = (height + paddingY) / outputNodes;
        for (let i = 0; i < outputNodes; i++) {
            this.ctx.fillText(this.ACTIONS[i], 600 - paddingX + 5, paddingY + 20 + cellHeightOutput * i);
        }
    }

    private renderInputLabels(height: number, paddingY: number, inputNodes: number, paddingX: number) {
        this.ctx.font = '14px Arial';
        const cellHeightInput = (height + paddingY) / inputNodes;
        for (let i = 0; i < inputNodes; i++) {
            const w = this.ctx.measureText('this.inputs[i].toFixed(2)').width;
            this.ctx.fillText(this.inputs[i].toFixed(2), paddingX + 5 - w/2, paddingY + 20 + cellHeightInput * i);
        }
    }
}
import Network from "./Network";

export default class NetworkInterface {
    private network: Network;
    private ctx: CanvasRenderingContext2D;
    private activeOutput: number = 0;
    private inputs: number[] = [];
    private canvasWidth: number;
    private canvasHeight: number;

    private readonly ACTIONS: string[] = [
        'Move right',
        'Move left',
        'Move up',
        'Move down',
        'Rotate right',
        'Rotate left',
        'Shoot'
    ];

    constructor(network: Network, canvas: HTMLCanvasElement) {
        this.network = network;

        this.ctx = canvas.getContext('2d');
        this.canvasWidth = canvas.width;
        this.canvasHeight = canvas.height;
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

        const height = this.canvasHeight - (paddingY * 2);

        const inputNodes = this.network.getInputNodes();
        const outputNodes = this.network.getOutputNodes();
        const hiddenNodes = this.network.getHiddenNodes();

        this.renderInputToHiddenWeights(height, inputNodes, hiddenNodes, paddingX, paddingY);
        this.renderHiddenToOutputWeights(height, hiddenNodes, outputNodes, paddingX, paddingY);
        this.renderInput(height, inputNodes, paddingX, paddingY);
        this.renderHidden(height, hiddenNodes, paddingY);
        this.renderOutput(height, outputNodes, paddingX, paddingY);
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

    private renderHidden(height: number, hiddenNodes: number, paddingY: number) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'yellow';

        const cellHeightHidden = (height + paddingY) / hiddenNodes;
        for (let i = 0; i < hiddenNodes; i++) {
            this.ctx.arc(
                this.canvasWidth / 2,
                paddingY + cellHeightHidden * i + 15,
                15,
                0,
                Math.PI * 2
            );
        }
        this.ctx.fill();
    }

    private renderOutput(height: number, outputNodes: number, paddingX: number, paddingY: number) {
        this.ctx.beginPath();
        this.ctx.fillStyle = 'blue';

        const cellHeightOutput = (height + paddingY) / outputNodes;
        for (let i = 0; i < outputNodes; i++) {
            this.ctx.arc(
                this.canvasWidth - paddingX - 15,
                paddingY + cellHeightOutput * i + 15,
                15,
                0,
                Math.PI * 2
            );
        }
        this.ctx.fill();

        this.ctx.beginPath();
        this.ctx.fillStyle = 'green';
        this.ctx.arc(this.canvasWidth - paddingX - 15,
            paddingY + cellHeightOutput * this.activeOutput + 15,
            15,
            0,
            Math.PI * 2
        );
        this.ctx.fill();
    }

    private renderInputToHiddenWeights(height: number, inputNodes: number, hiddenNodes: number, paddingX: number, paddingY: number) {
        const cellHeightInput = (height + paddingY) / inputNodes
        const cellHeightHidden = (height + paddingY) / hiddenNodes;

        for (let i = 0; i < inputNodes; i++) {
            for (let j = 0; j < hiddenNodes; j++) {
                this.ctx.beginPath();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'red';
                this.ctx.moveTo(15 + paddingX, paddingY + cellHeightInput * i + 15);
                this.ctx.lineTo(this.canvasWidth / 2, paddingY + cellHeightHidden * j + 15);
                this.ctx.stroke();
            }
        }
    }

    private renderHiddenToOutputWeights(height: number, hiddenNodes: number, outputNodes: number, paddingX: number, paddingY: number) {
        const cellHeightHidden = (height + paddingY) / hiddenNodes;
        const cellHeightOutput = (height + paddingY) / outputNodes;

        for (let i = 0; i < hiddenNodes; i++) {
            for (let j = 0; j < outputNodes; j++) {
                this.ctx.beginPath();
                this.ctx.lineWidth = 1;
                this.ctx.strokeStyle = 'blue';
                this.ctx.moveTo(this.canvasWidth / 2, paddingY + cellHeightHidden * i + 15);
                this.ctx.lineTo(this.canvasWidth - paddingX - 15, paddingY + cellHeightOutput * j + 15);
                this.ctx.stroke();
            }
        }
    }

    private renderOutputLabels(height: number, paddingY: number, outputNodes: number, paddingX: number) {
        this.ctx.font = '14px Arial';
        const cellHeightOutput = (height + paddingY) / outputNodes;
        for (let i = 0; i < outputNodes; i++) {
            this.ctx.fillStyle = i == this.activeOutput ? 'green' : 'blue';
            this.ctx.fillText(this.ACTIONS[i], this.canvasWidth - paddingX + 5, paddingY + 20 + cellHeightOutput * i);
        }
    }

    private renderInputLabels(height: number, paddingY: number, inputNodes: number, paddingX: number) {
        this.ctx.font = '14px Arial';
        const cellHeightInput = (height + paddingY) / inputNodes;
        for (let i = 0; i < inputNodes; i++) {
            if (this.inputs.length <= i) {
                break;
            }

            const w = this.ctx.measureText('this.inputs[i].toFixed(2)').width;
            this.ctx.fillText(this.inputs[i].toFixed(2), paddingX + 5 - w / 2, paddingY + 20 + cellHeightInput * i);
        }
    }
}
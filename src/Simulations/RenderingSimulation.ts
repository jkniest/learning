import Simulation from "./Simulation";

export default class RenderingSimulation extends Simulation {
    protected readonly canvas: HTMLCanvasElement;
    protected readonly ctx: CanvasRenderingContext2D;

    constructor(maxTime: number, canvas: HTMLCanvasElement, waiting: boolean = false) {
        super(maxTime, waiting);

        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
    }

    protected update(deltaTime: number) {
        super.update(deltaTime);
        this.draw();
    }

    private draw() {
        this.ctx.clearRect(0, 0, 600, 600);

        this.entities.forEach(entity => entity.draw(this.ctx));

        this.ctx.fillStyle = this.running ? 'black' : 'red';
        this.ctx.font = '20px Arial';

        const label = this.running
            ? `${Math.round(this.timer)} seconds left`
            : 'Simulation ended';

        const textWidth = this.ctx.measureText(label).width;
        this.ctx.fillText(label, this.canvas.width - textWidth - 20, 30);

        if (this.running) {
            return;
        }

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        this.ctx.fillRect(0, this.canvas.height / 2 - 50, this.canvas.width, 100);

        this.ctx.font = '36px Arial';
        this.ctx.fillStyle = 'white';

        const winLabel = `${this.killed ? 'Defeated!' : 'Draw!'} ${this.winner.getName()} wins!`;
        const winSize = this.ctx.measureText(winLabel);

        this.ctx.fillText(
            winLabel,
            this.canvas.width / 2 - winSize.width / 2,
            this.canvas.height / 2 + 12
        );
    }

}
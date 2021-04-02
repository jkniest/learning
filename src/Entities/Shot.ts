import Entity from "./Entity";
import Simulation from "../Simulation";

export default class Shot extends Entity {
    private readonly red: number = 0;
    private readonly green: number = 0;
    private readonly blue: number = 0;

    constructor(posX: number, posY: number, rotation: number, red: number, green: number, blue: number) {
        super(posX, posY);

        this.rotation = rotation;
        this.red = red;
        this.green = green;
        this.blue = blue;
    }

    draw(ctx: CanvasRenderingContext2D): void {
        ctx.beginPath();
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.arc(this.posX, this.posY, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
    }

    update(deltaTime: number): void {
        this.posX += Math.cos(this.rotation * Math.PI / 180) * 3;
        this.posY += Math.sin(this.rotation * Math.PI / 180) * 3;

        if (this.posX > 600 || this.posX < 0 || this.posY > 600 || this.posY < 0) {
            Simulation.Instance.removeEntity(this);
        }
    }

}
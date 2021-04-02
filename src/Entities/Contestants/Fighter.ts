import Entity from "../Entity";
import Shot from "../Shot";
import Network from "../../NeuralNetwork/Network";
import Simulation from "../../Simulations/Simulation";

// @ts-ignore
import names from '../../names.json';
import Manager from "../../Manager";

export default class Fighter extends Entity {
    private readonly red: number = 0;
    private readonly green: number = 0;
    private readonly blue: number = 0;

    private preview: CanvasRenderingContext2D | null;
    private readonly simulation: Simulation;

    private shootDelay = 1;
    private network: Network;
    private enemy: Fighter;
    private killed: boolean = false;
    private readonly name: string;

    public readonly SPEED = 3;

    public readonly ACTION_MOVE_RIGHT: number = 0;
    public readonly ACTION_MOVE_LEFT: number = 1;
    public readonly ACTION_MOVE_UP: number = 2;
    public readonly ACTION_MOVE_DOWN: number = 3;
    public readonly ACTION_ROTATE_RIGHT: number = 4;
    public readonly ACTION_ROTATE_LEFT: number = 5;
    public readonly ACTION_SHOOT: number = 6;

    constructor(
        posX: number,
        posY: number,
        simulation: Simulation,
        networkCanvas?: HTMLCanvasElement,
        previewCanvas?: HTMLCanvasElement,
        nameField?: HTMLHeadingElement,
        red?: number,
        green?: number,
        blue?: number
    ) {
        super(posX, posY, 60, 60);

        this.red = red ?? (Math.random() * 255);
        this.green = green ?? (Math.random() * 255);
        this.blue = blue ?? (Math.random() * 255);
        this.simulation = simulation;

        this.network = new Network(9, 6, 7, networkCanvas);
        this.preview = previewCanvas?.getContext('2d');

        this.name = names[Math.round(Math.random() * names.length)];
        if (nameField) {
            nameField.innerText = this.name;
        }

        this.rotation = Math.random() * 360;
    }

    public draw(ctx: CanvasRenderingContext2D): void {
        ctx.translate(this.posX, this.posY);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.translate(-this.posX, -this.posY);

        ctx.beginPath();
        ctx.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        ctx.arc(this.posX, this.posY, 30, 0, Math.PI * 2);
        ctx.rect(this.posX + 15, this.posY - 5, 36, 10);
        ctx.fill();

        ctx.setTransform(1, 0, 0, 1, 0, 0);

        if (this.killed) {
            ctx.beginPath();
            ctx.lineWidth = 6;
            ctx.strokeStyle = 'red';
            ctx.moveTo(this.leftX, this.topY);
            ctx.lineTo(this.rightX, this.bottomY);

            ctx.moveTo(this.rightX, this.topY);
            ctx.lineTo(this.leftX, this.bottomY);
            ctx.stroke();
        }

        this.drawCollisionBox(ctx);

        this.network.draw();
        this.drawPreview();
    }

    public setPreview(canvas: HTMLCanvasElement) {
        this.preview = canvas.getContext('2d');
        this.drawPreview();
    }

    private drawPreview(): void {
        if (!this.preview) {
            return;
        }

        this.preview.clearRect(0, 0, 100, 100);

        this.preview.translate(46, 50);
        this.preview.rotate(this.rotation * Math.PI / 180);
        this.preview.translate(-46, -50);

        this.preview.beginPath();
        this.preview.fillStyle = `rgb(${this.red}, ${this.green}, ${this.blue})`;
        this.preview.arc(50 - 4, 50, 24, 0, Math.PI * 2);
        this.preview.rect(50 - 4 + 15, 50 - 5, 26, 8);
        this.preview.fill();

        this.preview.setTransform(1, 0, 0, 1, 0, 0);
    }

    public update(deltaTime: number): void {
        if (!this.enemy) {
            this.enemy = this.simulation.getAllFighter().filter(
                enemy => enemy != this
            )[0] as Fighter;
        }

        this.shootDelay -= deltaTime * this.simulation.getSpeed();

        const nearestShot = this.getNearestShot();
        const action = this.network.calculate([
            this.posX / 600,
            this.posY / 600,
            this.rotation / 360,
            nearestShot ? nearestShot.getPosX() / 600 : 0,
            nearestShot ? nearestShot.getPosY() / 600 : 0,
            nearestShot ? nearestShot.getRotation() / 360 : 0,
            this.enemy.posX / 600,
            this.enemy.posY / 600,
            this.enemy.rotation / 360,
        ]);

        switch (action) {
            case this.ACTION_MOVE_RIGHT:
                this.posX += this.SPEED * this.simulation.getSpeed();
                if (this.posX > 600) {
                    this.posX = 600;
                }
                break;

            case this.ACTION_MOVE_LEFT:
                this.posX -= this.SPEED * this.simulation.getSpeed();
                if (this.posX < 0) {
                    this.posX = 0;
                }
                break;

            case this.ACTION_MOVE_UP:
                this.posY -= this.SPEED * this.simulation.getSpeed();
                if (this.posY < 0) {
                    this.posY = 0;
                }
                break;

            case this.ACTION_MOVE_DOWN:
                this.posY += this.SPEED * this.simulation.getSpeed();
                if (this.posY > 600) {
                    this.posY = 600;
                }
                break;

            case this.ACTION_ROTATE_LEFT:
                this.rotation -= this.SPEED * this.simulation.getSpeed();
                if (this.rotation < 0) {
                    this.rotation = 360 - this.rotation;
                }

                break;

            case this.ACTION_ROTATE_RIGHT:
                this.rotation += this.SPEED * this.simulation.getSpeed();
                if (this.rotation > 360) {
                    this.rotation = this.rotation - 360;
                }
                break;

            case this.ACTION_SHOOT:
                if (this.shootDelay <= 0) {
                    this.shoot();
                }
                break;
        }
    }

    private shoot(): void {
        const spawnX = this.posX + Math.cos(this.rotation * Math.PI / 180) * 60;
        const spawnY = this.posY + Math.sin(this.rotation * Math.PI / 180) * 60;

        this.simulation.addEntity(
            new Shot(spawnX, spawnY, this.rotation, this.red, this.green, this.blue, this.simulation)
        );

        this.shootDelay = 1;
    }

    private getNearestShot(): Entity | null {
        const all = this.simulation.getAllShots();

        let target: Entity | null = null;
        let lastDistance: number = Number.MAX_VALUE;

        for (let shot of all) {
            const distance = Math.sqrt(
                Math.pow(shot.getPosX() - this.posX, 2)
                +
                Math.pow(shot.getPosY() - this.posY, 2)
            );

            if (distance < lastDistance) {
                lastDistance = distance;
                target = shot;
            }
        }

        return target;
    }

    public getName(): string {
        return this.name;
    }

    public kill(): void {
        this.killed = true;
    }
}
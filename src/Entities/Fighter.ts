import Entity from "./Entity";
import Simulation from "../Simulation";
import Shot from "./Shot";
import Network from "../NeuralNetwork/Network";

export default class Fighter extends Entity {
    private readonly red: number = 0;
    private readonly green: number = 0;
    private readonly blue: number = 0;
    private shootDelay = 1;
    private network: Network;
    private enemy: Fighter;

    public readonly SPEED = 3;

    public readonly ACTION_MOVE_RIGHT: number = 0;
    public readonly ACTION_MOVE_LEFT: number = 1;
    public readonly ACTION_MOVE_UP: number = 2;
    public readonly ACTION_MOVE_DOWN: number = 3;
    public readonly ACTION_ROTATE_RIGHT: number = 4;
    public readonly ACTION_ROTATE_LEFT: number = 5;
    public readonly ACTION_SHOOT: number = 6;

    constructor(posX: number, posY: number, render: boolean = false, red?: number, green?: number, blue?: number) {
        super(posX, posY);

        this.red = red ?? (Math.random() * 255);
        this.green = green ?? (Math.random() * 255);
        this.blue = blue ?? (Math.random() * 255);
        this.network = new Network(9, 7, render);
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

        this.network.draw();
    }

    public update(deltaTime: number): void {
        if (!this.enemy) {
            this.enemy = Simulation.Instance.getAllFighter().filter(
                enemy => enemy != this
            )[0] as Fighter;
        }

        this.shootDelay -= deltaTime;

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
                this.posX += this.SPEED;
                if (this.posX > 600) {
                    this.posX = 600;
                }
                break;

            case this.ACTION_MOVE_LEFT:
                this.posX -= this.SPEED;
                if (this.posX < 0) {
                    this.posX = 0;
                }
                break;

            case this.ACTION_MOVE_UP:
                this.posY -= this.SPEED;
                if (this.posY < 0) {
                    this.posY = 0;
                }
                break;

            case this.ACTION_MOVE_DOWN:
                this.posY += this.SPEED;
                if (this.posY > 600) {
                    this.posY = 600;
                }
                break;

            case this.ACTION_ROTATE_LEFT:
                this.rotation -= this.SPEED;
                if (this.rotation < 0) {
                    this.rotation = 360 - this.rotation;
                }

                break;

            case this.ACTION_ROTATE_RIGHT:
                this.rotation += this.SPEED;
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

        Simulation.Instance.addEntity(
            new Shot(spawnX, spawnY, this.rotation, this.red, this.green, this.blue)
        );

        this.shootDelay = 1;
    }

    private getNearestShot(): Entity|null {
        const all = Simulation.Instance.getAllShots();

        let target: Entity|null = null;
        let lastDistance: number = Number.MAX_VALUE;

        for(let shot of all) {
            const distance = Math.sqrt(
                Math.pow(shot.getPosX() - this.posX ,2)
                +
                Math.pow(shot.getPosY() - this.posY ,2)
            );

            if (distance < lastDistance) {
                lastDistance = distance;
                target = shot;
            }
        }

        return target;
    }
}
import Entity from "../Entities/Entity";
import Fighter from "../Entities/Contestants/Fighter";
import Shot from "../Entities/Shot";

export default class Simulation {
    protected entities: Entity[] = [];
    protected lastFrame = 0;
    protected speed: number = 1;
    protected timer: number = 5;
    protected running: boolean = true;
    protected winner: Fighter;

    constructor() {
        this.spawnFighters();

        this.lastFrame = new Date().getTime();
        requestAnimationFrame(this.loop.bind(this));
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    private loop() {
        const deltaTime = (new Date().getTime() - this.lastFrame) / 1000;
        this.lastFrame = new Date().getTime();

        this.update(deltaTime);

        requestAnimationFrame(this.loop.bind(this));
    }

    public getAllShots(): Entity[] {
        return this.entities.filter(
            entity => entity instanceof Shot
        );
    }

    public getAllFighter(): Fighter[] {
        return this.entities.filter(
            entity => entity instanceof Fighter
        ) as Fighter[];
    }

    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);
        this.entities.splice(index, 1);
    }

    public getSpeed(): number {
        return this.speed;
    }

    protected update(deltaTime: number) {
        if (!this.running) {
            return;
        }

        this.timer -= deltaTime;

        this.entities.forEach(entity => entity.update(deltaTime));

        if (this.timer <= 0) {
            this.terminate();
        }
    }

    private terminate() {
        this.pickRandomWinner();
        this.running = false;
    }

    protected spawnFighters(): void {
        this.addEntity(new Fighter(200, 150, this));
        this.addEntity(new Fighter(400, 450, this));
    }

    protected pickRandomWinner(): void
    {
        this.winner = this.getAllFighter()[Math.round(Math.random())];
    }
}
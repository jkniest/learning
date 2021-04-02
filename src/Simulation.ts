import Entity from "./Entities/Entity";
import Fighter from "./Entities/Fighter";
import Shot from "./Entities/Shot";

export default class Simulation {
    public static Instance: Simulation;

    private entities: Entity[] = [];
    private readonly canvas: HTMLCanvasElement;
    private readonly context: CanvasRenderingContext2D;
    private lastFrame = 0;

    constructor() {
        Simulation.Instance = this;

        this.addEntity(new Fighter(200, 150, true));
        this.addEntity(new Fighter(400, 450, true));

        this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
        this.context = this.canvas.getContext('2d');

        this.lastFrame = new Date().getTime();

        requestAnimationFrame(this.loop.bind(this));
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    private loop() {
        this.entities.forEach(entity => entity.update(
            (new Date().getTime() - this.lastFrame) / 1000
        ));
        this.lastFrame = new Date().getTime();

        this.context.clearRect(0, 0, 600, 600);
        this.entities.forEach(entity => entity.draw(this.context));

        requestAnimationFrame(this.loop.bind(this));
    }

    public getAllShots(): Entity[] {
        return this.entities.filter(
            entity => entity instanceof Shot
        );
    }

    public getAllFighter(): Entity[] {
        return this.entities.filter(
            entity => entity instanceof Fighter
        );
    }

    public removeEntity(entity: Entity): void {
        const index = this.entities.indexOf(entity);
        this.entities.splice(index, 1);
    }
}
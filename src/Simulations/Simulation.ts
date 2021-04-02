import Entity from "../Entities/Entity";
import Fighter from "../Entities/Contestants/Fighter";
import Shot from "../Entities/Shot";
import Manager from "../Manager";
import FighterData from "../FighterData";

export default class Simulation {
    protected entities: Entity[] = [];
    protected lastFrame = 0;
    protected timer: number = 60;
    protected running: boolean = true;
    protected winner: Fighter;
    protected killed: boolean = false;
    protected stopped: boolean = false;
    protected initialFighters: FighterData[] = [];

    constructor(maxTime: number, waiting: boolean = false, fighter1?: FighterData, fighter2?: FighterData) {
        this.timer = maxTime;

        if (fighter1) {
            this.initialFighters.push(fighter1);
        }

        if (fighter2) {
            this.initialFighters.push(fighter2);
        }

        if (waiting) {
            return;
        }

        this.start();
    }

    public start(): void {
        this.spawnFighters();
        Manager.Instance.simulationStarted(this);

        this.lastFrame = new Date().getTime();
        requestAnimationFrame(this.loop.bind(this));
    }

    public addEntity(entity: Entity) {
        this.entities.push(entity);
    }

    private loop() {
        if (this.stopped) {
            return;
        }

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
        return Manager.Instance.getSpeed();
    }

    protected update(deltaTime: number) {
        if (!this.running) {
            return;
        }

        this.timer -= deltaTime * Manager.Instance.getSpeed();

        this.entities.forEach(entity => entity.update(deltaTime));

        if (this.timer <= 0) {
            this.terminate();
        }
    }

    protected terminate() {
        this.pickRandomWinner();
        this.running = false;

        Manager.Instance.report(this);
    }

    protected spawnFighters(): void {
        if (this.initialFighters.length === 0) {
            this.addEntity(new Fighter(200, 150, this));
            this.addEntity(new Fighter(400, 450, this));
            return;
        }

        this.addEntity(this.initialFighters[0].toFighter(200, 150, this, null, null, null));
        this.addEntity(this.initialFighters[1].toFighter(400, 450, this, null, null, null, true));
    }

    protected pickRandomWinner(): void
    {
        this.winner = this.getAllFighter()[Math.round(Math.random())];
    }

    public lose(loser: Fighter) {
        this.winner = this.getAllFighter().filter(
            fighter => fighter != loser
        )[0];

        this.running = false;
        this.killed = true;

        Manager.Instance.report(this);
    }

    public get wasDraw(): boolean {
        return !this.killed;
    }

    public getWinner(): Fighter {
        return this.winner;
    }

    public stop(): void {
        this.stopped = true;
        Manager.Instance.simulationStopped(this);
    }
}
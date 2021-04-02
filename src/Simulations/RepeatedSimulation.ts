import RenderingSimulation from "./RenderingSimulation";
import Fighter from "../Entities/Contestants/Fighter";

export default class RepeatedSimulation extends RenderingSimulation {
    private fighter1: Fighter;
    private fighter2: Fighter;

    constructor(maxTime: number, canvas: HTMLCanvasElement) {
        super(maxTime, canvas, true);
    }

    public initialize(fighter1: Fighter, fighter2: Fighter, winner: Fighter) {
        this.fighter1 = fighter1;
        this.fighter2 = fighter2;
        this.winner = winner;

        this.start();
    }

    protected spawnFighters() {
        this.addEntity(this.fighter1);
        this.addEntity(this.fighter2);
    }

    protected terminate() {
        this.running = false;
        this.stop();
    }

    public lose(loser: Fighter) {
        this.running = false;
        this.killed = true;
        this.stop();
    }
}
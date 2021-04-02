import Simulation from "./Simulations/Simulation";
import PrimarySimulation from "./Simulations/PrimarySimulation";
import RenderingSimulation from "./Simulations/RenderingSimulation";
import Result from "./Result";

export default class Manager {
    public static Instance: Manager;

    private parallelSimulations: number = 100;
    private speed: number = 1;
    private time: number = 30;
    private showCollisionBoxes: boolean = false;

    private counterRunning: HTMLSpanElement;
    private counterFinished: HTMLSpanElement;
    private counterTotal: HTMLSpanElement;

    private finished: number = 0;
    private simulations: Simulation[] = [];

    constructor() {
        Manager.Instance = this;

        this.counterRunning = document.getElementById('counter-running') as HTMLSpanElement;
        this.counterFinished = document.getElementById('counter-finished') as HTMLSpanElement;
        this.counterTotal = document.getElementById('counter-total') as HTMLSpanElement;

        const buttonStartSlow = document.getElementById('btn-start-slow') as HTMLButtonElement;
        buttonStartSlow.addEventListener('click', () => {
            this.parallelSimulations = parseInt((document.getElementById('count') as HTMLInputElement).value);
            this.speed = parseInt((document.getElementById('speed') as HTMLInputElement).value);
            this.time = parseInt((document.getElementById('time') as HTMLInputElement).value);

            this.startSimulations();
        });

        const buttonCollision = document.getElementById('btn-collision') as HTMLButtonElement;
        buttonCollision.addEventListener('click', () => this.toggleCollisionBoxes(buttonCollision));

        if(localStorage.getItem('collision') === '1') {
            this.toggleCollisionBoxes(buttonCollision);
        }

        //this.startSimulations();
    }

    private startSimulations(): void {
        this.updateCounter();

        document.getElementById('panel-menu').classList.add('hidden');
        document.getElementById('panel-simulation').classList.remove('hidden');

        for (let i = 0; i < this.parallelSimulations; i++) {
            if (i === 0) {
                this.simulations.push(new PrimarySimulation(
                    this.time,
                    document.getElementById('canvas') as HTMLCanvasElement
                ));
                continue;
            }

            if (i > 0 && i < 5) {
                this.simulations.push(new RenderingSimulation(
                    this.time,
                    document.getElementById(`sub-${i}`) as HTMLCanvasElement
                ));
                continue;
            }

            this.simulations.push(new Simulation(this.time));
        }
    }

    private updateCounter() {
        this.counterTotal.innerText = this.parallelSimulations.toString();
        this.counterRunning.innerText = (this.parallelSimulations - this.finished).toString();
        this.counterFinished.innerText = this.finished.toString();
    }

    public report(simulation: Simulation) {
        this.finished++;
        this.updateCounter();

        if (this.finished >= this.parallelSimulations) {
            this.endGeneration();
        }
    }

    public getSpeed(): number {
        return this.speed;
    }

    public get collisionBoxes(): boolean {
        return this.showCollisionBoxes;
    }

    private toggleCollisionBoxes(buttonCollision: HTMLButtonElement): void {
        this.showCollisionBoxes = !this.showCollisionBoxes;
        buttonCollision.innerText = this.showCollisionBoxes ? 'Hide collision boxes' : 'Show collision boxes';

        if (this.showCollisionBoxes) {
            localStorage.setItem('collision', '1');
            return;
        }

        localStorage.removeItem('collision');
    }

    private endGeneration(): void {
        document.getElementById('panel-simulation').classList.add('hidden');
        document.getElementById('panel-result').classList.remove('hidden');

        new Result(this.simulations);
    }
}

new Manager();
import Simulation from "./Simulations/Simulation";
import PrimarySimulation from "./Simulations/PrimarySimulation";
import RenderingSimulation from "./Simulations/RenderingSimulation";

export default class Manager {
    public static Instance: Manager;

    private parallelSimulations: number = 100;
    private speed: number = 1;

    private counterRunning: HTMLSpanElement;
    private counterFinished: HTMLSpanElement;
    private counterTotal: HTMLSpanElement;

    private finished: number = 0;

    constructor() {
        Manager.Instance = this;

        this.counterRunning = document.getElementById('counter-running') as HTMLSpanElement;
        this.counterFinished = document.getElementById('counter-finished') as HTMLSpanElement;
        this.counterTotal = document.getElementById('counter-total') as HTMLSpanElement;

        const buttonStartSlow = document.getElementById('btn-start-slow') as HTMLButtonElement;
        buttonStartSlow.addEventListener('click', () => {
            this.parallelSimulations = parseInt((document.getElementById('count') as HTMLInputElement).value);
            this.speed = parseInt((document.getElementById('speed') as HTMLInputElement).value);

            this.startSimulations();
        });

        //this.startSimulations();
    }

    private startSimulations(): void {
        this.updateCounter();

        document.getElementById('panel-menu').classList.add('hidden');
        document.getElementById('panel-simulation').classList.remove('hidden');

        for (let i = 0; i < this.parallelSimulations; i++) {
            if (i === 0) {
                new PrimarySimulation(
                    document.getElementById('canvas') as HTMLCanvasElement
                );
                continue;
            }

            if (i > 0 && i < 5) {
                new RenderingSimulation(
                    document.getElementById(`sub-${i}`) as HTMLCanvasElement
                );
                continue;
            }

            new Simulation();
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
    }

    public getSpeed(): number {
        return this.speed;
    }
}

new Manager();
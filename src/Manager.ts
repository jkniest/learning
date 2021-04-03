import Simulation from "./Simulations/Simulation";
import PrimarySimulation from "./Simulations/PrimarySimulation";
import RenderingSimulation from "./Simulations/RenderingSimulation";
import Result from "./Result";
import Generation from "./Generation";
import Fighter from "./Entities/Contestants/Fighter";
import FighterData from "./FighterData";

export default class Manager {
    public static Instance: Manager;

    private parallelSimulations: number = 100;
    private speed: number = 1;
    private time: number = 5;
    private showCollisionBoxes: boolean = false;

    private counterRunning: HTMLSpanElement;
    private counterFinished: HTMLSpanElement;
    private counterTotal: HTMLSpanElement;
    private counterGeneration: HTMLSpanElement;

    private finished: number = 0;
    private simulations: Simulation[] = [];

    private generations: Generation[] = [];
    private currentGeneration: Generation;

    private runningSimulations: Simulation[] = [];

    constructor() {
        Manager.Instance = this;

        this.counterRunning = document.getElementById('counter-running') as HTMLSpanElement;
        this.counterFinished = document.getElementById('counter-finished') as HTMLSpanElement;
        this.counterTotal = document.getElementById('counter-total') as HTMLSpanElement;
        this.counterGeneration = document.getElementById('counter-generation') as HTMLSpanElement;

        const buttonStartSlow = document.getElementById('btn-start-slow') as HTMLButtonElement;
        buttonStartSlow.addEventListener('click', () => {
            this.parallelSimulations = parseInt((document.getElementById('count') as HTMLInputElement).value);
            this.speed = parseInt((document.getElementById('speed') as HTMLInputElement).value);
            this.time = parseInt((document.getElementById('time') as HTMLInputElement).value);

            this.startNewGeneration();
        });

        const buttonCollision = document.getElementById('btn-collision') as HTMLButtonElement;
        buttonCollision.addEventListener('click', () => this.toggleCollisionBoxes(buttonCollision));

        if(localStorage.getItem('collision') === '1') {
            this.toggleCollisionBoxes(buttonCollision);
        }

        //this.startNewGeneration();
    }

    private startSimulations(original?: FighterData[], mutated?: FighterData[]): void {
        this.simulations = [];
        this.finished = 0;
        this.updateCounter();

        document.getElementById('panel-menu').classList.add('hidden');
        document.getElementById('panel-result').classList.add('hidden');
        document.getElementById('panel-simulation').classList.remove('hidden');

        for (let i = 0; i < this.parallelSimulations; i++) {
            if (i === 0) {
                this.simulations.push(new PrimarySimulation(
                    this.time,
                    document.getElementById('canvas') as HTMLCanvasElement,
                    false,
                    original?.[i],
                    mutated?.[i],
                ));
                continue;
            }

            if (i > 0 && i < 5) {
                this.simulations.push(new RenderingSimulation(
                    this.time,
                    document.getElementById(`sub-${i}`) as HTMLCanvasElement,
                    false,
                    original?.[i],
                    mutated?.[i]
                ));
                continue;
            }

            this.simulations.push(new Simulation(this.time, false, original?.[i], mutated?.[i]));
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

    public getMaxTime(): number {
        return this.time;
    }

    public startNewGeneration(): void {
        this.runningSimulations.forEach(simulation => simulation.stop());

        if (!this.currentGeneration) {
            this.currentGeneration = new Generation(1);
            this.generations.push(this.currentGeneration);
            this.counterGeneration.innerText = this.currentGeneration.index.toString();
            this.startSimulations();
            return;
        }

        this.currentGeneration = new Generation(this.currentGeneration.index + 1);
        this.generations.push(this.currentGeneration);
        this.counterGeneration.innerText = this.currentGeneration.index.toString();

        const winners = this.simulations.map(simulation => {
            if (simulation.getWinner()) {
                return simulation.getWinner();
            }

            console.log("ERROR NO WINNER")
            console.log(simulation);

            return simulation.getWinner();
        });


        const newFighters = [
            ...winners.map(winner => FighterData.fromFighter(winner)),
            ...winners.map(winner => FighterData.fromFighter(winner).mutate(.5))
        ].shuffle();

        this.startSimulations(
            newFighters.slice(0, this.parallelSimulations),
            newFighters.slice(this.parallelSimulations, this.parallelSimulations * 2),
        );
    }

    public getCurrentGeneration(): Generation {
        return this.currentGeneration;
    }

    public simulationStarted(simulation: Simulation): void {
        this.runningSimulations.push(simulation);
    }

    public simulationStopped(simulation: Simulation): void {
        const index = this.runningSimulations.indexOf(simulation);
        this.runningSimulations.splice(index, 1);
    }
}

new Manager();
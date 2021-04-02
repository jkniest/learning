import Simulation from "./Simulations/Simulation";
import PrimarySimulation from "./Simulations/PrimarySimulation";
import RenderingSimulation from "./Simulations/RenderingSimulation";

export default class Manager {
    private parallelSimulations: number = 100;

    constructor() {
        const buttonStartSlow = document.getElementById('btn-start-slow') as HTMLButtonElement;
        buttonStartSlow.addEventListener('click', () => {
            this.startSimulations();
        });

        this.startSimulations();
    }

    private startSimulations(): void {
        document.getElementById('panel-menu').classList.add('hidden');
        document.getElementById('panel-simulation').classList.remove('hidden');

        for(let i = 0; i < this.parallelSimulations; i++) {
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
}

new Manager();
import Simulation from "./Simulations/Simulation";
import PrimarySimulation from "./Simulations/PrimarySimulation";
import RenderingSimulation from "./Simulations/RenderingSimulation";

export default class Manager {
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

        new PrimarySimulation(
            document.getElementById('canvas') as HTMLCanvasElement
        );

        new RenderingSimulation(
            document.getElementById('sub-1') as HTMLCanvasElement
        );

        new RenderingSimulation(
            document.getElementById('sub-2') as HTMLCanvasElement
        );

        new RenderingSimulation(
            document.getElementById('sub-3') as HTMLCanvasElement
        );

        new RenderingSimulation(
            document.getElementById('sub-4') as HTMLCanvasElement
        );
    }
}

new Manager();
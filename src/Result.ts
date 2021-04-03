import Chart from 'chart.js';
import Simulation from "./Simulations/Simulation";
import Fighter from "./Entities/Contestants/Fighter";
import RepeatedSimulation from "./Simulations/RepeatedSimulation";
import Manager from "./Manager";

export default class Result {
    private readonly total: number = 0;
    private readonly draw: number = 0;
    private readonly defeated: number = 0;
    private readonly simulations: Simulation[];

    private static chart: Chart;

    constructor(simulations: Simulation[]) {
        this.simulations = simulations;
        this.total = simulations.length;
        this.draw = simulations.filter(simulation => simulation.wasDraw).length;
        this.defeated = this.total - this.draw;

        Result.registerListeners();
        this.stopSimulations();
        this.pickRandomWinners();
        this.drawChart();

        document.getElementById('result-generation').innerText = Manager.Instance.getCurrentGeneration().index.toString();
    }

    private pickRandomWinners(): void {
        let winners = this.simulations.filter(simulation => !simulation.wasDraw)
            .map(simulation => simulation.getWinner());

        let notSoWinner = this.simulations.filter(simulation => simulation.wasDraw)
            .map(simulation => simulation.getWinner())
            .shuffle();

        winners.push(...notSoWinner);

        if (winners.length < 4) {
            console.log("WINNER LESS THAN 4");
            console.log("Simulations:")
            console.log(this.simulations);

            console.log("Winners:")
            console.log(winners);

            console.log("No so winners:")
            console.log(notSoWinner);
        }

        for (let i = 0; i < 4; i++) {
            const winnerBox = document.getElementById(`winner-${i + 1}`);
            winnerBox.classList.remove('hidden');
            document.getElementById(`winnerName${i + 1}`).innerText = winners[i].getName();
            winners[i].setPreview(
                document.getElementById(`winner${i + 1}-preview`) as HTMLCanvasElement
            );

            winnerBox.addEventListener('click', () => {
                Result.repeat(winners[i]);
            });
        }
    }

    private static repeat(winner: Fighter): void {
        const simulation = new RepeatedSimulation(
            Manager.Instance.getMaxTime(),
            document.getElementById('canvas') as HTMLCanvasElement
        );

        const fighter1 = new Fighter(
            winner.getStartX(),
            winner.getStartY(),
            simulation,
            null,
            null,
            null,
            winner.getRed(),
            winner.getGreen(),
            winner.getBlue(),
            winner.getName(),
            winner.getNetwork().serialize()
        );

        const fighter2 = new Fighter(
            winner.getEnemy().getStartX(),
            winner.getEnemy().getStartY(),
            simulation,
            null,
            null,
            null,
            winner.getEnemy().getRed(),
            winner.getEnemy().getGreen(),
            winner.getEnemy().getBlue(),
            winner.getEnemy().getName(),
            winner.getEnemy().getNetwork().serialize()
        );

        simulation.initialize(fighter1, fighter2, fighter1);
    }

    private drawChart(): void {
        const canvas = document.getElementById('result') as HTMLCanvasElement;

        Result.chart = new Chart(canvas.getContext('2d'), {
            type: 'pie',
            data: {
                labels: ['Draw', 'Defeat'],
                datasets: [{
                    label: '# of Votes',
                    data: [this.draw, this.defeated],
                    backgroundColor: [
                        '#DC2626',
                        '#059669',
                    ],
                    borderColor: [
                        '#7F1D1D',
                        '#064E3B',
                    ]
                }],
            },
            options: {
                layout: {
                    padding: {
                        bottom: 10
                    }
                }
            }
        });
    }

    private static shuffle(input: Fighter[]): Fighter[] {
        let j, x, i;
        for (i = input.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = input[i];
            input[i] = input[j];
            input[j] = x;
        }

        return input;
    }

    private stopSimulations(): void {
        this.simulations.forEach(simulation => simulation.stop());
    }

    private static registerListeners(): void {
        document.getElementById('btn-next-gen').addEventListener('click', Result.actionRunNextGeneration);
    }

    private static clearListeners() {
        document.getElementById('btn-next-gen').removeEventListener('click', Result.actionRunNextGeneration);

        for(let i = 1; i <= 4; i++) {
            const element = document.getElementById(`winner-${i}`);
            const clone = element.cloneNode(true);
            element.parentNode.replaceChild(clone, element);
        }


        Result.chart.destroy();
    }

    private static actionRunNextGeneration(): void {
        Result.clearListeners();
        Manager.Instance.startNewGeneration();
    }
}
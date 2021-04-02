import Chart from 'chart.js';
import Simulation from "./Simulations/Simulation";
import Fighter from "./Entities/Contestants/Fighter";

export default class Result {
    private total: number = 0;
    private draw: number = 0;
    private defeated: number = 0;
    private simulations: Simulation[];

    constructor(simulations: Simulation[]) {
        this.simulations = simulations;
        this.total = simulations.length;
        this.draw = simulations.filter(simulation => simulation.wasDraw).length;
        this.defeated = this.total - this.draw;

        this.pickRandomWinners();
        this.drawChart();
    }

    private pickRandomWinners(): void {
        this.shuffle();

        const winners = this.simulations.slice(0, 4).map(simulation => simulation.getWinner());
        for(let i = 0; i < winners.length; i++) {
            document.getElementById(`winner-${i+1}`).classList.remove('hidden');
            document.getElementById(`winnerName${i+1}`).innerText = winners[i].getName();
            winners[i].setPreview(
                document.getElementById(`winner${i+1}-preview`) as HTMLCanvasElement
            );
        }
    }

    private drawChart(): void {
        const canvas = document.getElementById('result') as HTMLCanvasElement;

        new Chart(canvas.getContext('2d'), {
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
        })
    }

    private shuffle(): void {
        let j, x, i;
        for (i = this.simulations.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = this.simulations[i];
            this.simulations[i] = this.simulations[j];
            this.simulations[j] = x;
        }
    }
}
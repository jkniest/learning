import Simulation from "./Simulations/Simulation";
import Fighter from "./Entities/Contestants/Fighter";
import Network from "./NeuralNetwork/Network";

export default class FighterData {
    public name: string;
    public red: number;
    public green: number;
    public blue: number;
    public network: string;
    public startPositionX: number;
    public startPositionY: number;
    public originalGeneration: number|null;

    constructor(
        name: string,
        red: number,
        green: number,
        blue: number,
        network: string,
        startPositionX: number,
        startPositionY: number,
        originalGeneration: number
    ) {
        this.name = name;
        this.red = red;
        this.green = green;
        this.blue = blue;
        this.network = network;
        this.startPositionX = startPositionX;
        this.startPositionY = startPositionY;
        this.originalGeneration = originalGeneration;
    }

    public static fromFighter(fighter: Fighter): FighterData {
        return new FighterData(
            fighter.getName(),
            fighter.getRed(),
            fighter.getGreen(),
            fighter.getBlue(),
            fighter.getNetwork().serialize(),
            fighter.getStartX(),
            fighter.getStartY(),
            fighter.getOriginalGeneration()
        );
    }

    public toFighter(
        posX: number,
        posY: number,
        simulation: Simulation,
        networkCanvas?: HTMLCanvasElement,
        previewCanvas?: HTMLCanvasElement,
        nameField?: HTMLHeadingElement,
        randomName: boolean = false
    ): Fighter {
        return new Fighter(
            posX,
            posY,
            simulation,
            networkCanvas,
            previewCanvas,
            nameField,
            this.red,
            this.green,
            this.blue,
            randomName ? null : this.name,
            this.network,
            this.originalGeneration
        );
    }

    public mutate(rate: number): FighterData {
        this.originalGeneration = null;

        const chance = 10;

        if (Math.random() * 100 < chance) {
            this.red += Math.random() * (rate*2 + 1) - rate;
            this.red = this.clamp(this.red, 0, 255);
        }

        if (Math.random() * 100 < chance) {
            this.green += Math.random() * (rate*2 + 1) - rate;
            this.green = this.clamp(this.green, 0, 255);
        }

        if (Math.random() * 100 < chance) {
            this.blue += Math.random() * (rate*2 + 1) - rate;
            this.blue = this.clamp(this.blue, 0, 255);
        }

        this.network = Network.fromSerialized(this.network).mutate(chance, rate).serialize();

        return this;
    }

    private clamp(value: number, min: number, max: number): number {
        if (value < min) {
            return min;
        }

        if (value > max) {
            return max;
        }

        return value;
    }
}
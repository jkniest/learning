import FighterData from "./FighterData";
import Fighter from "./Entities/Contestants/Fighter";

export default class Generation {
    public readonly index: number;
    public fighters: FighterData[] = [];

    constructor(index: number) {
        this.index = index;
    }

    public addFighter(fighter: Fighter): void {
        this.fighters.push(new FighterData(
            fighter.getName(),
            fighter.getRed(),
            fighter.getGreen(),
            fighter.getBlue(),
            fighter.getNetwork().serialize(),
            fighter.getStartX(),
            fighter.getStartY()
        ));
    }
}
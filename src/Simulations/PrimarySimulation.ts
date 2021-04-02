import RenderingSimulation from "./RenderingSimulation";
import Fighter from "../Entities/Contestants/Fighter";

export default class PrimarySimulation extends RenderingSimulation {
    protected spawnFighters() {
        this.addEntity(new Fighter(
            200,
            150,
            this,
            document.getElementById('network') as HTMLCanvasElement,
            document.getElementById('preview') as HTMLCanvasElement,
            document.getElementById('name') as HTMLHeadingElement
        ));

        this.addEntity(new Fighter(
            400,
            150, // 450,
            this,
            document.getElementById('network2') as HTMLCanvasElement,
            document.getElementById('preview2') as HTMLCanvasElement,
            document.getElementById('name2') as HTMLHeadingElement
        ));
    }
}
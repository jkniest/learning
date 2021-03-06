import RenderingSimulation from "./RenderingSimulation";
import Fighter from "../Entities/Contestants/Fighter";

export default class PrimarySimulation extends RenderingSimulation {
    protected spawnFighters() {
        if (this.initialFighters.length === 0) {
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
                450,
                this,
                document.getElementById('network2') as HTMLCanvasElement,
                document.getElementById('preview2') as HTMLCanvasElement,
                document.getElementById('name2') as HTMLHeadingElement
            ));
            return;
        }

        this.addEntity(this.initialFighters[0].toFighter(
            200,
            150,
            this,
            document.getElementById('network') as HTMLCanvasElement,
            document.getElementById('preview') as HTMLCanvasElement,
            document.getElementById('name') as HTMLHeadingElement
        ));


        this.addEntity(this.initialFighters[1].toFighter(
            400,
            450,
            this,
            document.getElementById('network2') as HTMLCanvasElement,
            document.getElementById('preview2') as HTMLCanvasElement,
            document.getElementById('name2') as HTMLHeadingElement,
            true
        ));
    }
}
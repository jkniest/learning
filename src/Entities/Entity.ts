export default abstract class Entity {
    protected posX: number;
    protected posY: number;
    protected rotation: number = 0;

    protected constructor(posX: number, posY: number) {
        this.posX = posX;
        this.posY = posY;
    }

    public abstract draw(ctx: CanvasRenderingContext2D): void;
    public abstract update(deltaTime: number): void;

    public getPosX(): number {
        return this.posX;
    }

    public getPosY(): number {
        return this.posY;
    }

    public getRotation(): number {
        return this.rotation;
    }
}
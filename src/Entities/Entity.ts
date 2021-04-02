import Manager from "../Manager";

export default abstract class Entity {
    protected posX: number;
    protected posY: number;
    protected rotation: number = 0;
    protected width: number;
    protected height: number;

    protected constructor(posX: number, posY: number, width: number, height: number) {
        this.posX = posX;
        this.posY = posY;
        this.width = width;
        this.height = height;
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

    public get leftX(): number {
        return this.posX - this.width / 2;
    }

    public get rightX(): number {
        return this.posX + this.width / 2;
    }

    public get topY(): number {
        return this.posY - this.height / 2;
    }

    public get bottomY(): number {
        return this.posY + this.height / 2;
    }

    public collidesWith(target: Entity): boolean {
        return this.leftX < target.leftX + target.width &&
            this.leftX + this.width > target.leftX &&
            this.topY < target.topY + target.height &&
            this.topY + this.height > target.topY;
    }

    public drawCollisionBox(ctx: CanvasRenderingContext2D): void {
        if (!Manager.Instance.collisionBoxes) {
            return;
        }

        ctx.beginPath();
        ctx.strokeStyle = 'green';
        ctx.lineWidth = 1;
        ctx.rect(this.leftX, this.topY, this.width, this.height);
        ctx.stroke();
    }
}
export class Replicant {
    constructor(private path: String, public name: String, public content: String) {
        this.path = path;
        this.name = name;
        this.content = content;
    }

    public setContent(content: string) {
        this.content = content;
    }
}
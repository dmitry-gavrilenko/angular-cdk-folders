import * as uuid from 'uuid';

export class Folder {
    name: string;
    uId: string;
    children: Folder[];

    constructor(options: { name: string; children?: Folder[] }) {
        this.name = options.name;
        this.uId = uuid.v4();
        this.children = options.children || [];
    }
}

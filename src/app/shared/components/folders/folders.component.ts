import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Folder } from '../../models/folder.model';

@Component({
    selector: 'folders',
    templateUrl: './folders.component.html',
    styleUrls: ['./folders.component.scss'],
})
export class FoldersComponent {
    @Input() item: Folder;
    @Input() parentItem: Folder;
    @Input() public set connectedDropListsIds(ids: string[]) {
        this.allDropListsIds = ids;
    }
    public get connectedDropListsIds(): string[] {
        return this.allDropListsIds.filter((id) => id !== this.item.uId);
    }
    public allDropListsIds: string[];

    public get dragDisabled(): boolean {
        return !this.parentItem;
    }

    public get parentItemId(): string {
        return this.dragDisabled ? '' : this.parentItem.uId;
    }

    @Output() itemDrop: EventEmitter<CdkDragDrop<Folder>>;
    @Output() itemDragStart: EventEmitter<null>;
    @Output() itemDragEnd: EventEmitter<null>;

    constructor() {
        this.allDropListsIds = [];
        this.itemDrop = new EventEmitter();
        this.itemDragStart = new EventEmitter();
        this.itemDragEnd = new EventEmitter();
    }

    public onDragDrop(event: CdkDragDrop<Folder, Folder>): void {
        this.itemDrop.emit(event);
    }

    public onDragStarted() {
        console.log("Start");
        this.itemDragStart.emit();
    }

    public onDragEnded() {
        console.log("Stop");
        this.itemDragEnd.emit();
    }
}

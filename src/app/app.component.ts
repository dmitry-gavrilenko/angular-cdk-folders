import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CdkDragDrop, CdkDragEnter, CdkDragExit, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Folder } from './shared/models/folder.model';

/**
 * @title Drag&Drop connected sorting
 */
@Component({
    selector: 'app',
    templateUrl: 'app.component.html',
    styleUrls: ['app.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class AppComponent implements OnInit {
    public parentItem: Folder;

    public isDragging = false;

    public get connectedDropListsIds(): string[] {
        // We reverse ids here to respect items nesting hierarchy
        return this.getIdsRecursive(this.parentItem).reverse();
    }

    constructor() {
        this.parentItem = new Folder({ name: 'parent-item' });
    }

    ngOnInit(): void {
        this.parentItem.children.push(
            new Folder({
                name: 'test1',
                children: [new Folder({ name: 'subItem1' }), new Folder({ name: 'subItem2' }), new Folder({ name: 'subItem3' })],
            })
        );
        this.parentItem.children.push(
            new Folder({
                name: 'test2',
                children: [
                    new Folder({ name: 'subItem4' }),
                    new Folder({ name: 'subItem5' }),
                    new Folder({
                        name: 'subItem6',
                        children: [new Folder({ name: 'subItem8' })],
                    }),
                ],
            })
        );
        this.parentItem.children.push(new Folder({ name: 'test3' }));
    }

    public onDragDrop(event: CdkDragDrop<Folder>) {
        event.container.element.nativeElement.classList.remove('active');
        if (this.canBeDropped(event)) {
            const movingItem: Folder = event.item.data;
            event.container.data.children.push(movingItem);
            event.previousContainer.data.children = event.previousContainer.data.children.filter((child) => child.uId !== movingItem.uId);
        } else {
            moveItemInArray(event.container.data.children, event.previousIndex, event.currentIndex);
        }
    }

    private getIdsRecursive(item: Folder): string[] {
        let ids = [item.uId];
        item.children.forEach((childItem) => {
            ids = ids.concat(this.getIdsRecursive(childItem));
        });
        return ids;
    }

    private canBeDropped(event: CdkDragDrop<Folder, Folder>): boolean {
        const movingItem: Folder = event.item.data;

        return (
            event.previousContainer.id !== event.container.id &&
            this.isNotSelfDrop(event) &&
            !this.hasChild(movingItem, event.container.data)
        );
    }

    private isNotSelfDrop(event: CdkDragDrop<Folder> | CdkDragEnter<Folder> | CdkDragExit<Folder>): boolean {
        return event.container.data.uId !== event.item.data.uId;
    }

    private hasChild(parentItem: Folder, childItem: Folder): boolean {
        const hasChild = parentItem.children.some((item) => item.uId === childItem.uId);
        return hasChild ? true : parentItem.children.some((item) => this.hasChild(item, childItem));
    }
}

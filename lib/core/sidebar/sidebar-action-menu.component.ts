/*!
 * @license
 * Copyright 2016 Alfresco Software, Ltd.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';

@Component({
    selector: 'adf-sidebar-action-menu',
    templateUrl: './sidebar-action-menu.component.html',
    styleUrls: ['./sidebar-action-menu.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class SidebarActionMenuComponent {

    @Input()
    title: string;

    @Input()
    titleIcon: string;

    @Input()
    menuList: any[];

    @Input()
    expanded = true;

    @Output()
    menuOption: EventEmitter<string> = new EventEmitter<string>();

    onMenuOptionClick(action: string): void {
        this.menuOption.emit(action)
        console.log(action);
    }

    isExpanded(): boolean {
        return this.expanded;
    }
}
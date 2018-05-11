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

import { Input, ContentChild } from '@angular/core';
import { AppConfigService } from '../../app-config/app-config.service';
import { DataColumnListComponent } from '../../data-column/data-column-list.component';
import { DataColumn } from './data-column.model';
import { ObjectDataColumn } from './object-datacolumn.model';

export class DataColumnSchemaAssembler {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @Input()
    presetColumn: string;

    /** The ID of the folder node to display or a reserved string alias for special sources */
    @Input()
    currentFolderId: string = null;

    layoutPresets = {};

    loadLayoutPresets(appConfigService: AppConfigService, presetsModel: any, presetKey: string): void {
        const externalSettings = appConfigService.get(presetKey, null);
        if (externalSettings) {
            this.layoutPresets = Object.assign({}, presetsModel, externalSettings);
        } else {
            this.layoutPresets = presetsModel;
        }
    }

    getSchema(): any {
        let customSchemaColumns = [];
        customSchemaColumns = this.getSchemaFromConfig(this.currentFolderId).concat(this.getSchemaFromHtml());
        if (customSchemaColumns.length === 0) {
            customSchemaColumns = this.getDefaultLayoutPreset();
        }
        return customSchemaColumns;
    }

    getSchemaFromHtml(): any {
        let schema = [];
        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }
        return schema;
    }

    getSchemaFromConfig(name: string): DataColumn[] {
        return name ? (this.layoutPresets[name]).map(col => new ObjectDataColumn(col)) : [];
    }

    getDefaultLayoutPreset(): DataColumn[] {
        return (this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }
}

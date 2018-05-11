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
import {
    AppConfigService,
    DataColumn, ObjectDataColumn,
    DataColumnListComponent
} from '@alfresco/adf-core';

export class DemoSchemaConfig {

    @ContentChild(DataColumnListComponent) columnList: DataColumnListComponent;

    @Input()
    presetColumn: string;

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
        customSchemaColumns = this.getSchemaFromConfig(this.presetColumn).concat(this.getSchemaFromHtml());
        if (customSchemaColumns.length === 0) {
            customSchemaColumns = this.getDefaultLayoutPreset();
        }
        return customSchemaColumns;
    }

    private getSchemaFromHtml(): any {
        let schema = [];
        if (this.columnList && this.columnList.columns && this.columnList.columns.length > 0) {
            schema = this.columnList.columns.map(c => <DataColumn> c);
        }
        return schema;
    }

    private getSchemaFromConfig(name: string): DataColumn[] {
        return name ? (this.layoutPresets[name]).map(col => new ObjectDataColumn(col)) : [];
    }

    private getDefaultLayoutPreset(): DataColumn[] {
        return (this.layoutPresets['default']).map(col => new ObjectDataColumn(col));
    }
}
